# Feature Specification: UX Refinements - Layout Reorganization and Content Expansion

**Feature Branch**: `006-ux-refinements`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "Now that we have the basics working, let's refine and improve the user experience. Please move the offline caching elements to the very bottom of the page (i.e., the storage bar and "clear cache" button). Please move the "previous", "play/pause", and "next" buttons to the top of the page (between the search bar and song list). Show the "new version available" banner, only when needed (currently, it's there all the time). Last but not least, let's add the five new audio files I copied into our `src/songs` folder (i.e., a1.mp3, a2.mp3, a3.mp3, a4.mp3, a5.mp3, which their corresponding titles are: "Waterfall in a forest", "Thunderstorm & Rain", "Cafe Music", "Brown Noise", "Rainy Day"). Use a generic "music note" icon for those for now. Please let me know if you have questions. Thanks!"

## Clarifications

### Session 2026-02-01

- Q: What type of generic "music note" icon should be used for the 5 new songs? → A: Unicode musical note character (♫ or ♪)
- Q: What artist name should be displayed for the 5 new ambient songs? → A: "Ambient Sounds" or similar category name
- Q: Should the playback controls at the top of the page use sticky positioning or static positioning? → A: Sticky positioning at bottom of screen (not top)
- Q: Should the "new version available" banner appear at the top of the page or in another location? → A: Top of page (static, scrolls away)
- Q: How should the duration be determined for the 5 new ambient songs (a1.mp3 through a5.mp3)? → A: Display "∞" (infinity symbol) for ambient tracks

## User Scenarios & Testing

### User Story 1 - Access New Audio Content (Priority: P1)

Users can access and play 5 new ambient audio tracks (nature sounds and background music) that have been added to the music library. These tracks provide relaxation and focus content beyond the existing acoustic songs.

**Why this priority**: This provides immediate user value by expanding the content library, which is the core purpose of the music player. Users have requested more diverse audio content for different moods and activities.

**Independent Test**: Can be fully tested by opening the application, searching for the new songs, and verifying they play correctly. Delivers value even if no other stories are implemented.

**Acceptance Scenarios**:

1. **Given** the application is loaded with the updated catalog, **When** a user views the song list, **Then** all 5 new songs appear in the list with correct titles ("Waterfall in a forest", "Thunderstorm & Rain", "Cafe Music", "Brown Noise", "Rainy Day"), artist name "Ambient Sounds", and duration "∞"
2. **Given** the new songs are visible in the list, **When** a user taps on any new song, **Then** the song plays and the play/pause button updates to show the playing state
3. **Given** a user is playing one of the new songs, **When** the song completes, **Then** playback advances to the next song in the list
4. **Given** the song list is displayed, **When** a user searches for "waterfall" or any new song title, **Then** only matching new songs appear in the search results
5. **Given** the new songs have been played, **When** the user revisits the application, **Then** the new songs are still available in the catalog

---

### User Story 2 - Intuitive Playback Control Placement (Priority: P2)

Users can access the primary playback controls (previous, play/pause, next) in a prominent location at the bottom of the screen, making them easily accessible for thumb-based interaction and always visible while scrolling through the song list.

**Why this priority**: This improves the user experience by placing controls within easy reach on mobile devices (future mobile-first consideration) and keeps them always visible via sticky positioning while browsing songs. It's a usability enhancement that doesn't add new functionality but makes existing features easier to use.

**Independent Test**: Can be fully tested by opening the application and verifying the button positions. Delivers value as a standalone improvement regardless of other stories.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** a user views the page layout, **Then** the previous, play/pause, and next buttons appear at the bottom of the screen
2. **Given** the playback controls are at the bottom, **When** a user taps the play/pause button, **Then** the currently selected song plays or pauses as expected
3. **Given** the playback controls are at the bottom, **When** a user taps the previous or next buttons, **Then** the player advances to the adjacent song in the playlist
4. **Given** the song list is visible, **When** a user selects a song from the list, **Then** the bottom controls update to reflect the new song's state
5. **Given** the user scrolls through a long song list, **When** playback controls are needed, **Then** they remain visible at the bottom of the screen via sticky positioning

---

### User Story 3 - Non-Intrusive Cache Management (Priority: P3)

Users can manage offline cache (view storage usage and clear cached songs) through elements placed at the very bottom of the page, keeping this advanced functionality accessible but not cluttering the main interface.

**Why this priority**: This is a usability improvement for power users who want to manage storage, but it's lower priority because most users won't interact with these controls frequently. It enhances the application without affecting core functionality.

**Independent Test**: Can be fully tested by verifying the position of cache elements and testing their functionality. Delivers value as a standalone improvement.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** a user scrolls to the bottom of the page, **Then** the storage usage bar and clear cache button are visible at the bottom of the page
2. **Given** cache elements are at the bottom, **When** a user views the storage bar, **Then** it displays the current storage usage and quota accurately
3. **Given** the user has cached songs, **When** the user taps the clear cache button, **Then** all cached songs are removed from storage and the storage bar updates to 0
4. **Given** the cache elements are at the bottom, **When** a user views the top of the page, **Then** the cache management elements are not visible (they are positioned at the bottom, requiring scrolling to access)

---

### User Story 4 - Contextual Update Notifications (Priority: P3)

Users only see the "new version available" banner at the top of the page when a new version of the application actually exists, preventing visual clutter and confusion from unnecessary notifications. The banner is positioned statically at the top and scrolls away with page content.

**Why this priority**: This fixes a bug where the banner appears constantly even when no update is available. While it improves user experience, it's lower priority because it doesn't affect core functionality and most users will see the banner rarely anyway.

**Independent Test**: Can be fully tested by simulating different update scenarios and verifying banner visibility. Delivers value as a standalone bug fix.

**Acceptance Scenarios**:

1. **Given** no new version of the application is available, **When** the application loads, **Then** the "new version available" banner remains hidden at the top of the page
2. **Given** a new version of the application is available, **When** the application detects this, **Then** the "new version available" banner becomes visible at the top of the page
3. **Given** the update banner is visible at the top, **When** a user taps the refresh button, **Then** the application reloads to get the latest version
4. **Given** the user has refreshed to the latest version, **When** the application reloads, **Then** the update banner is hidden again
5. **Given** the update banner is visible, **When** a user scrolls down the page, **Then** the banner scrolls away with the content (static positioning)

---

### Edge Cases

- **What happens when** the audio files are missing or corrupted? The song should still appear in the catalog but display an error when attempting to play
- **How does system handle** a very long list of songs? The playback controls at the top should remain visible while scrolling through the song list
- **What happens when** storage quota is full? The storage warning should appear at the bottom of the page and the user should be able to clear cache to free space
- **How does system handle** simultaneous update detection and cache clearing? Both UI elements should function independently without conflicts
- **What happens when** a new song has special characters in the title? The title should display correctly in the song list and search results

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display all 5 new audio tracks in the song catalog with the exact titles: "Waterfall in a forest", "Thunderstorm & Rain", "Cafe Music", "Brown Noise", and "Rainy Day"
- **FR-001-A**: The system MUST display "Ambient Sounds" or similar category name as the artist for all 5 new ambient songs
- **FR-001-B**: The system MUST display "∞" (infinity symbol) as the duration for all 5 new ambient songs
- **FR-002**: The system MUST associate each new song with a Unicode musical note character (♫ or ♪) for visual consistency
- **FR-003**: The system MUST allow users to play each of the 5 new songs by selecting them from the song list
- **FR-004**: The system MUST include the 5 new songs in search results when users search by title or keyword
- **FR-005**: The system MUST position the playback controls (previous, play/pause, next buttons) at the bottom of the screen with sticky positioning to remain visible while scrolling
- **FR-006**: The system MUST maintain all existing playback control functionality (play, pause, previous, next) after repositioning the controls
- **FR-007**: The system MUST position the storage usage information bar at the very bottom of the page
- **FR-008**: The system MUST position the clear cache button at the very bottom of the page
- **FR-009**: The system MUST display the "new version available" banner at the top of the page only when a new application version is detected
- **FR-010**: The system MUST position the update banner with static placement at the top of the page (scrolls away with content)
- **FR-011**: The system MUST hide the "new version available" banner by default and only show it when an update is actually available
- **FR-012**: The system MUST allow users to dismiss or respond to the update notification when it appears
- **FR-013**: The system MUST ensure all repositioned elements (playback controls, cache management, update banner) retain their original functionality

### Key Entities

- **Audio Track**: Represents a playable audio file with metadata (title, artist, duration or "∞" for ambient tracks, file path, album art icon)
- **Playback Controls**: Interface elements (previous, play/pause, next buttons) that control media playback
- **Cache Management UI**: Interface elements (storage bar, clear cache button) that display and manage offline storage
- **Update Notification**: Banner element that alerts users when a new application version is available

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can access all 5 new audio tracks within 3 seconds of page load
- **SC-002**: Users can find and play any new song in under 5 seconds through the song list or search
- **SC-003**: 95% of users successfully locate the playback controls at their new position on their first visit
- **SC-004**: Users can access cache management controls after scrolling to the bottom of the page
- **SC-005**: The "new version available" banner appears only when an update exists (zero false positives)
- **SC-006**: All repositioned UI elements retain 100% of their original functionality (no regression bugs)
- **SC-007**: Users can complete a full playback cycle (play a new song, pause, skip to next) without issues

## Assumptions

- The 5 audio files (a1.mp3 through a5.mp3) are present in the src/songs directory
- The application already has update detection logic that needs minor adjustment for the banner visibility
- Users scroll vertically through the song list, making top placement of controls more discoverable
- Cache management is an advanced feature that users access infrequently, justifying bottom placement
- The application supports standard audio playback for all file formats

## Notes

- The new songs are ambient audio tracks (nature sounds, white noise, background music) which serve a different use case than the existing acoustic songs
- This feature is purely a UX refinement - no new backend or data storage capabilities are required
- The reorganization follows common music player UX patterns where controls are at the top and advanced settings are at the bottom
