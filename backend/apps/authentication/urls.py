from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.login_view, name='user-login'),
    path('logout/', views.logout_view, name='user-logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Profile management
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('settings/', views.UserSettingsView.as_view(), name='user-settings'),
    path('profile/extended/', views.ExtendedProfileView.as_view(), name='extended-profile'),
    
    # Consent management
    path('consent/', views.update_consent_view, name='update-consent'),
    path('consent/history/', views.ConsentHistoryView.as_view(), name='consent-history'),
    path('consent/check/', views.check_consent_view, name='check-consent'),
    
    # User statistics and account management
    path('stats/', views.user_stats_view, name='user-stats'),
    path('delete-account/', views.delete_account_view, name='delete-account'),
]