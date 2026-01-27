# Feature Specification: Dynamic Catalog & Search

**Feature Branch**: `002-dynamic-catalog`
**Created**: 2026-01-26
**Status**: Draft
**Input**: User description: "Load songs dynamically from JSON catalog with search functionality"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Load Songs from Catalog (Priority: P1)

As a user, I want to see all available songs loaded automatically from a catalog so that new songs can be added without changing the code.

**Why this priority**: This is the foundation of the dynamic music player. Without loading songs from an external source, users cannot benefit from an expandable catalog. This enables the core value proposition of a dynamic, maintainable system.

**Independent Test**: Can be fully tested by opening the application and verifying that all songs from the catalog.json file are displayed with their metadata visible on screen, delivering immediate awareness of all available content without code changes.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the page renders, **Then** all songs from catalog.json are displayed automatically
2. **Given** a catalog with multiple songs, **When** the user views the page, **Then** each song shows title, artist, and duration (if provided)
3. **Given** the catalog is loading, **When** the fetch is in progress, **Then** a loading indicator is displayed
4. **Given** the catalog fails to load, **When** an error occurs, **Then** a user-friendly error message is shown with a retry button

---

### User Story 2 - Search and Filter Songs (Priority: P1)

As a user, I want to search for songs by title or artist so that I can quickly find specific music in a large catalog.

**Why this priority**: Search is essential for usability when the catalog grows beyond a few songs. Without search, users must manually scroll through all songs, which creates friction and reduces the app's utility with larger catalogs.

**Independent Test**: Can be fully tested by typing a search term and verifying that only matching songs are displayed in real-time, delivering efficient content discovery without manual navigation.

**Acceptance Scenarios**:

1. **Given** a catalog of songs, **When** the user types a search term, **Then** the list filters to show only matching songs
2. **Given** the user searches by title, **When** they type song title text, **Then** songs with matching titles are displayed
3. **Given** the user searches by artist, **When** they type artist name text, **Then** songs by matching artists are displayed
4. **Given** search text is entered, **When** the user clears the search, **Then** all songs are displayed again
5. **Given** no songs match the search, **When** filtering completes, **Then** a "no results" message is displayed
6. **Given** search input has text, **When** the user types quickly, **Then** filtering is debounced to avoid performance issues

---

### User Story 3 - View Visual Playback Indicators (Priority: P2)

As a user, I want to clearly see which song is currently playing so that I always know the app's current state at a glance.

**Why this priority**: Visual feedback improves user experience by reducing cognitive load. Without clear indicators, users may lose track of what's playing or the current state, especially when browsing a large catalog.

**Independent Test**: Can be fully tested by playing a song and verifying that the currently playing song is visually distinct from others, delivering immediate awareness of playback state without requiring focused attention.

**Acceptance Scenarios**:

1. **Given** a song is playing, **When** the user views the song list, **Then** the playing song is visually highlighted or marked
2. **Given** playback is paused, **When** the user views the song list, **Then** the paused song has a different visual state than playing songs
3. **Given** the user starts a new song, **When** playback begins, **Then** the visual indicator updates immediately to show the new playing song
4. **Given** no song is playing, **When** the user views the song list, **Then** no songs have the playing state indicator

---

### User Story 4 - View Song Metadata (Priority: P2)

As a user, I want to see detailed information about each song including album art so that I can make informed choices about what to play.

**Why this priority**: Metadata helps users discover and choose music based on preferences. Album art enhances the user experience and makes the catalog more visually appealing and professional.

**Independent Test**: Can be fully tested by viewing the song list and verifying that each song displays available metadata including title, artist, duration, and album art (when provided), delivering rich content information that supports decision-making.

**Acceptance Scenarios**:

1. **Given** a song in the catalog, **When** the user views the song card, **Then** the song title is clearly visible
2. **Given** a song in the catalog, **When** the user views the song card, **Then** the artist name is clearly visible
3. **Given** a song has duration data, **When** the user views the song card, **Then** the duration is displayed in MM:SS format
4. **Given** a song has album art URL, **When** the user views the song card, **Then** the album art image is displayed
5. **Given** a song has no album art URL, **When** the user views the song card, **Then** a placeholder or default icon is displayed
6. **Given** the user is on a mobile device, **When** viewing song metadata, **Then** the text is readable and touch targets are adequate

---

### Edge Cases

- What happens when catalog.json is empty or missing required fields? System should display an error message and handle gracefully
- How does system handle when album art images fail to load? System should show placeholder images and prevent broken image icons
- What happens when search contains special characters? System should handle all text input safely and filter correctly
- How does system handle when a song URL is invalid or returns 404? System should show an error and prevent playback
- What happens when catalog has duplicate song IDs? System should handle duplicates gracefully or warn user
- How does system handle when search returns no results? System should show a friendly "no results" message with clear action option
- What happens when user types very quickly in search? System should debounce input to avoid performance issues
- How does system handle when catalog is very large (100+ songs)? System should maintain performance with efficient filtering and lazy loading

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load songs from a catalog.json file on application startup
- **FR-002**: System MUST validate catalog.json structure and display error if format is invalid
- **FR-003**: System MUST display all songs from the catalog in a list format
- **FR-004**: System MUST show song metadata including title, artist, and duration (if available)
- **FR-005**: System MUST display album art for songs when URL is provided in catalog
- **FR-006**: System MUST display a placeholder for songs without album art
- **FR-007**: System MUST provide a search input field prominently in the UI
- **FR-008**: System MUST filter the song list in real-time as user types search query
- **FR-009**: System MUST search song titles in a case-insensitive manner
- **FR-010**: System MUST search artist names in a case-insensitive manner
- **FR-011**: System MUST support partial string matching (e.g., "beat" matches "The Beatles")
- **FR-012**: System MUST debounce search input to wait 300ms after user stops typing before filtering
- **FR-013**: System MUST provide a clear button in the search field to reset the filter
- **FR-014**: System MUST display a "no results" message when no songs match the search query
- **FR-015**: System MUST show a loading indicator while catalog.json is being fetched
- **FR-016**: System MUST display a user-friendly error message if catalog fetch fails
- **FR-017**: System MUST provide a retry button when catalog loading fails
- **FR-018**: System MUST visually indicate which song is currently playing in the song list
- **FR-019**: System MUST visually distinguish between playing and paused states
- **FR-020**: System MUST render the song list efficiently using batch DOM operations
- **FR-021**: System MUST lazy load album art images to prevent blocking page render
- **FR-022**: System MUST handle missing optional fields gracefully without breaking the UI

### Key Entities *(include if feature involves data)*

- **Song Catalog**: Represents the collection of all available songs loaded from external JSON file, contains array of song objects with metadata
- **Song**: Represents an individual piece of audio content with attributes including unique ID, title, artist name, audio URL, duration in seconds, album art URL (optional), file size (optional), and other metadata
- **Search Query**: Represents the user's current search input used to filter the song catalog by matching against song titles and artist names

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see a complete catalog of songs within 2 seconds of page load
- **SC-002**: Catalog of 50 songs loads and displays in under 1 second
- **SC-003**: Search filters results within 100ms of user completing input
- **SC-004**: Users can search and find specific songs in a catalog of 100+ songs within 3 seconds
- **SC-005**: Currently playing song is visually identifiable within 1 second of playback starting
- **SC-006**: Album art images load without blocking the initial page render
- **SC-007**: Application handles catalog loading errors gracefully with appropriate user feedback
- **SC-008**: Search functionality feels instant with no perceivable lag for users
- **SC-009**: New songs can be added to the catalog by editing catalog.json without code changes
- **SC-010**: All song metadata (title, artist, duration) is clearly readable on mobile devices (375px width)

### Assumptions

- catalog.json file is hosted on the same domain as the application or supports CORS
- Album art URLs are publicly accessible and support CORS
- Song audio URLs are publicly accessible or hosted on the same domain
- Users have network connectivity to load the catalog initially (offline support is Phase 3)
- Catalog will contain a reasonable number of songs (up to a few hundred) for this phase
- Browser supports Fetch API and ES6+ features

### Dependencies

- Phase 1 (static playback) must be completed and working
- catalog.json file must exist and be properly formatted
- Audio files referenced in catalog must be accessible
- Album art images must be accessible if provided

### Out of Scope

The following features are intentionally excluded from this phase:

- Caching songs or offline playback (that's Phase 3)
- Service Worker for offline functionality (that's Phase 3)
- IndexedDB for song storage (that's Phase 3)
- Playlist creation or management
- Sorting by title, artist, duration
- Filtering by genre, year, or other metadata
- Multiple catalog sources
- User-uploaded songs
- Sharing songs
- Song ratings or favorites
- Advanced search options (exact phrase, boolean operators)
- Pagination or virtualization for very large catalogs

These features may be considered for future phases after the dynamic catalog foundation is established.
