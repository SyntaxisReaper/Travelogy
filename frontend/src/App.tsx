import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🌐 Travelogy - Simple Version
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        Welcome to Travelogy! This is a minimal version to test functionality.
      </p>
      <div style={{
        margin: '40px auto',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: '#2196F3' }}>App Status</h2>
        <p>✅ React is working</p>
        <p>✅ No white screen</p>
        <p>✅ Basic styling applied</p>
        <p>✅ Ready for incremental feature addition</p>
      </div>
    </div>
  );
}

export default App;
              <Route path="/working" element={<LandingPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/list" element={<TripsListPage />} />
              <Route path="/trips/:id" element={<TripDetailsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/book" element={<BookingsPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/admin/feedback" element={<FeedbackAdminPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          </NotifyProvider>
        </Box>
        
        {/* Notification System */}
        <NotificationSystem
          notifications={notifications}
          onClearNotification={clearNotification}
          onClearAll={clearAllNotifications}
        />

        {/* Emergency SOS floating button */}
        <EmergencySOS />
        
        {/* Analytics Modal */}
        <AnalyticsModal
          open={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        {/* Theme floating button */}
        <ThemeFab onClick={() => setThemePanelOpen(true)} />

        {/* Contact floating button */}
        <ContactFab />

        {/* Footer */}
        <Box component="footer" sx={{ textAlign: 'center', py: 2, bgcolor: 'background.default', color: 'text.secondary' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Travelogy — <a href="/contact" style={{ color: '#1de9b6', textDecoration: 'none' }}>Contact Team SkyStack</a>
          </Typography>
        </Box>
      </Router>

      {/* Theme Panel (app-level) */}
      <ThemePanel
        open={themePanelOpen}
        onClose={() => setThemePanelOpen(false)}
        themeMode={themeMode}
        themeFont={themeFont}
        onChangeThemeMode={handleChangeThemeMode}
        onChangeThemeFont={handleChangeThemeFont}
      />
    </ThemeProvider>
  );
};

export default App;