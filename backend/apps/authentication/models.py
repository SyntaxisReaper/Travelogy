from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Extended user model with additional fields for TraveLogy"""
    
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    # Privacy settings
    data_sharing_consent = models.BooleanField(default=False)
    location_tracking_consent = models.BooleanField(default=False)
    analytics_consent = models.BooleanField(default=False)
    marketing_consent = models.BooleanField(default=False)
    
    # Profile settings
    is_active_tracker = models.BooleanField(default=True)
    preferred_language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'auth_user'
        
    def __str__(self):
        return self.email
        
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
        
    @property
    def has_given_basic_consent(self):
        return self.location_tracking_consent
        
    def update_last_activity(self):
        self.last_activity = timezone.now()
        self.save(update_fields=['last_activity'])


class ConsentLog(models.Model):
    """Track consent changes for compliance"""
    
    CONSENT_TYPES = [
        ('data_sharing', 'Data Sharing'),
        ('location_tracking', 'Location Tracking'),
        ('analytics', 'Analytics'),
        ('marketing', 'Marketing'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consent_logs')
    consent_type = models.CharField(max_length=20, choices=CONSENT_TYPES)
    granted = models.BooleanField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'consent_logs'
        ordering = ['-timestamp']
        
    def __str__(self):
        action = "granted" if self.granted else "revoked"
        return f"{self.user.email} {action} {self.consent_type} consent"


class UserProfile(models.Model):
    """Extended user profile information"""
    
    OCCUPATION_CHOICES = [
        ('student', 'Student'),
        ('employed', 'Employed'),
        ('self_employed', 'Self Employed'),
        ('unemployed', 'Unemployed'),
        ('retired', 'Retired'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES, blank=True)
    
    # Travel preferences
    preferred_transport_modes = models.JSONField(default=list, blank=True)
    frequent_destinations = models.JSONField(default=list, blank=True)
    
    # Gamification preferences
    public_profile = models.BooleanField(default=False)
    show_on_leaderboard = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        
    def __str__(self):
        return f"{self.user.email}'s profile"


class UserSettings(models.Model):
    """User application settings"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    
    # Notification settings
    trip_reminders = models.BooleanField(default=True)
    weekly_summary = models.BooleanField(default=True)
    achievement_notifications = models.BooleanField(default=True)
    
    # App behavior settings
    auto_trip_detection = models.BooleanField(default=True)
    confirm_trips = models.BooleanField(default=True)
    offline_mode_preferred = models.BooleanField(default=False)
    
    # Data settings
    sync_frequency = models.IntegerField(default=15)  # minutes
    data_retention_days = models.IntegerField(default=365)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_settings'
        
    def __str__(self):
        return f"{self.user.email}'s settings"