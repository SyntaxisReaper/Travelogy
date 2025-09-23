from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from apps.trips.models import Trip
from django.db.models import Count, Sum

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_analytics(request):
    """Get dashboard analytics for admin users"""
    
    # User statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(trips__isnull=False).distinct().count()
    
    # Trip statistics
    total_trips = Trip.objects.count()
    completed_trips = Trip.objects.filter(status='completed').count()
    total_distance = Trip.objects.aggregate(Sum('distance_km'))['distance_km__sum'] or 0
    
    # Mode breakdown
    mode_stats = Trip.objects.values('transport_mode').annotate(
        count=Count('id')
    ).order_by('-count')
    
    return Response({
        'users': {
            'total': total_users,
            'active': active_users,
        },
        'trips': {
            'total': total_trips,
            'completed': completed_trips,
            'total_distance': total_distance,
        },
        'mode_breakdown': list(mode_stats)
    })