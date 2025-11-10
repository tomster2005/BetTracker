#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

/**
 * Fetch all football fixtures for the next 72 hours across all leagues using API-Football
 * Dynamically calculates date range and saves filtered data to fixtures.json
 */

// Get API key from environment variable - DO NOT include actual key in code
const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
    console.error('❌ Error: API_FOOTBALL_KEY environment variable is required');
    console.error('Set it with: export API_FOOTBALL_KEY="your_api_key_here"');
    process.exit(1);
}

// Dynamically calculate date range (next 72 hours)
const now = new Date();
const endDate = new Date(now.getTime() + (72 * 60 * 60 * 1000)); // Add 72 hours in milliseconds

// Format dates for API (YYYY-MM-DD)
const formatDate = (date) => date.toISOString().split('T')[0];

// Format datetime for API (YYYY-MM-DD HH:MM:SS)
const formatDateTime = (date) => {
    return date.toISOString().replace('T', ' ').split('.')[0];
};

console.log(`🔍 Fetching fixtures from ${formatDateTime(now)} to ${formatDateTime(endDate)}`);

/**
 * Make HTTPS request to API-Football /fixtures endpoint
 * Fetches all leagues automatically by using date range without league filter
 */
function fetchFixtures() {
    const options = {
        hostname: 'v3.football.api-sports.io',
        path: `/fixtures?from=${formatDate(now)}&to=${formatDate(endDate)}&timezone=UTC`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'v3.football.api-sports.io'
        }
    };

    console.log(`📡 Making API request to: https://${options.hostname}${options.path}`);

    const req = https.request(options, (res) => {
        let data = '';

        // Collect response data
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Process complete response
        res.on('end', () => {
            console.log(`📊 Received ${data.length} bytes of data`);
            
            try {
                const response = JSON.parse(data);
                
                // Check for API errors
                if (response.errors && response.errors.length > 0) {
                    console.error('❌ API Error:', response.errors);
                    process.exit(1);
                }

                // Check API response structure
                if (!response.response) {
                    console.error('❌ Invalid API response structure');
                    console.error('Response:', response);
                    process.exit(1);
                }

                console.log(`📈 API returned ${response.response.length} total fixtures`);
                processFixtures(response.response);
                
            } catch (error) {
                console.error('❌ Error parsing API response:', error.message);
                console.error('Raw response:', data.substring(0, 500) + '...');
                process.exit(1);
            }
        });
    });

    // Handle request errors
    req.on('error', (error) => {
        console.error('❌ Request error:', error.message);
        process.exit(1);
    });

    // Send the request
    req.end();
}

/**
 * Process API response and extract essential information
 * Filters out matches that have already started
 */
function processFixtures(fixtures) {
    console.log(`⚽ Processing ${fixtures.length} fixtures...`);

    // Filter out matches that have already started (kickoff_time < now)
    const currentTime = new Date();
    const upcomingFixtures = fixtures.filter(fixture => {
        const kickoffTime = new Date(fixture.fixture.date);
        return kickoffTime > currentTime;
    });

    console.log(`🔮 Found ${upcomingFixtures.length} upcoming fixtures (${fixtures.length - upcomingFixtures.length} already started)`);

    // Extract essential information from each fixture
    const processedFixtures = upcomingFixtures.map(fixture => {
        const fixtureData = {
            // Match identification
            matchId: fixture.fixture.id,
            
            // Team information
            homeTeam: fixture.teams.home.name,
            awayTeam: fixture.teams.away.name,
            homeTeamId: fixture.teams.home.id,
            awayTeamId: fixture.teams.away.id,
            
            // League/competition information
            league: fixture.league.name,
            country: fixture.league.country,
            leagueId: fixture.league.id,
            season: fixture.league.season,
            
            // Match timing
            kickoffTime: fixture.fixture.date,
            
            // Match status
            status: fixture.fixture.status.long,
            
            // Venue information (optional)
            venue: fixture.fixture.venue ? {
                name: fixture.fixture.venue.name,
                city: fixture.fixture.venue.city
            } : null
        };

        // Add odds if available (optional)
        if (fixture.odds && fixture.odds.length > 0) {
            fixtureData.odds = fixture.odds.map(odd => ({
                bookmaker: odd.bookmaker.name,
                markets: odd.values
            }));
        }

        return fixtureData;
    });

    // Group fixtures by league for better organization
    const fixturesByLeague = {};
    processedFixtures.forEach(fixture => {
        const leagueKey = `${fixture.country} - ${fixture.league}`;
        if (!fixturesByLeague[leagueKey]) {
            fixturesByLeague[leagueKey] = [];
        }
        fixturesByLeague[leagueKey].push(fixture);
    });

    // Create final JSON structure with timestamp and metadata
    const output = {
        // Metadata
        lastUpdated: currentTime.toISOString(),
        totalFixtures: processedFixtures.length,
        totalLeagues: Object.keys(fixturesByLeague).length,
        
        // Date range information
        dateRange: {
            from: formatDateTime(now),
            to: formatDateTime(endDate),
            fromDate: formatDate(now),
            toDate: formatDate(endDate)
        },
        
        // All fixtures in chronological order
        fixtures: processedFixtures.sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime)),
        
        // Fixtures grouped by league
        fixturesByLeague: fixturesByLeague
    };

    saveToFile(output);
}

/**
 * Save filtered data to local JSON file named 'fixtures.json'
 * Includes error handling and success confirmation
 */
function saveToFile(data) {
    const filename = 'fixtures.json';
    
    try {
        // Write JSON file with proper formatting
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        
        // Success confirmation with detailed stats
        console.log(`\n✅ Successfully saved fixtures to ${filename}`);
        console.log(`📊 Total fixtures: ${data.totalFixtures}`);
        console.log(`🏆 Total leagues: ${data.totalLeagues}`);
        console.log(`📅 Date range: ${data.dateRange.fromDate} to ${data.dateRange.toDate}`);
        console.log(`🕒 Last updated: ${data.lastUpdated}`);
        console.log(`📁 File size: ${(fs.statSync(filename).size / 1024).toFixed(2)} KB`);
        
        // Show top 5 leagues by fixture count
        const leagueStats = Object.entries(data.fixturesByLeague)
            .map(([league, fixtures]) => ({ league, count: fixtures.length }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
            
        console.log('\n🏆 Top leagues by fixture count:');
        leagueStats.forEach((stat, index) => {
            console.log(`${index + 1}. ${stat.league}: ${stat.count} fixtures`);
        });
        
    } catch (error) {
        console.error('❌ Error saving file:', error.message);
        process.exit(1);
    }
}

// Execute the script
console.log('🚀 Starting fixture fetch script...');
fetchFixtures();