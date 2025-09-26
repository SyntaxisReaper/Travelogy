from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from django.db.models import Count, Sum, Avg
from .models import User, UserProfile, UserSettings, ConsentLog
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    UserSettingsSerializer, ExtendedUserProfileSerializer, ConsentUpdateSerializer,
    ConsentLogSerializer, UserStatsSerializer, ChangePasswordSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        user.update_last_activity()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    """User logout endpoint"""
    
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        request.user.update_last_activity()
        return super().update(request, *args, **kwargs)


class UserSettingsView(generics.RetrieveUpdateAPIView):
    """Get and update user settings"""
    
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        settings, created = UserSettings.objects.get_or_create(
            user=self.request.user
        )
        return settings


class ExtendedProfileView(generics.RetrieveUpdateAPIView):
    """Get and update extended user profile"""
    
    serializer_class = ExtendedUserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile


@api_view(['POST'])
def update_consent_view(request):
    """Update user consent preferences"""
    
    serializer = ConsentUpdateSerializer(
        instance=request.user,
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Consent updated successfully',
            'user': UserProfileSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConsentHistoryView(generics.ListAPIView):
    """View user's consent history"""
    
    serializer_class = ConsentLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ConsentLog.objects.filter(user=self.request.user)


@api_view(['GET'])
def user_stats_view(request):
    """Get user statistics"""
    
    user = request.user
    
    # Import Trip model here to avoid circular imports
    from apps.trips.models import Trip
    
    # Calculate statistics
    trips = Trip.objects.filter(user=user)
    
    stats = {
        'total_trips': trips.count(),
        'total_distance': trips.aggregate(
            total=Sum('distance_km')
        )['total'] or 0,
        'total_duration': trips.aggregate(
            total=Sum('duration_minutes')
        )['total'] or 0,
        'most_used_mode': trips.values('transport_mode').annotate(
            count=Count('id')
        ).order_by('-count').first()['transport_mode'] if trips.exists() else 'N/A',
        'trips_this_week': trips.filter(
            start_time__gte=timezone.now() - timezone.timedelta(days=7)
        ).count(),
        'trips_this_month': trips.filter(
            start_time__gte=timezone.now() - timezone.timedelta(days=30)
        ).count(),
        'current_streak': 0,  # TODO: Implement streak calculation
        'longest_streak': 0,  # TODO: Implement streak calculation
    }
    
    serializer = UserStatsSerializer(stats)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def change_password_view(request):
    """Change password for the authenticated user"""
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({ 'message': 'Password changed successfully' }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_account_view(request):
    """Delete user account (soft delete)"""
    
    user = request.user
    
    # Soft delete - deactivate account
    user.is_active = False
    user.save()
    
    return Response({
        'message': 'Account deactivated successfully'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def check_consent_view(request):
    """Check if user has given required consents"""
    
    user = request.user
    
    consent_status = {
        'has_basic_consent': user.has_given_basic_consent,
        'location_tracking': user.location_tracking_consent,
        'data_sharing': user.data_sharing_consent,
        'analytics': user.analytics_consent,
        'marketing': user.marketing_consent,
    }
    
    return Response(consent_status, status=status.HTTP_200_OK)


from django.utils import timezone