#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

/**
 * Fetch upcoming football fixtures from API-Football for the next 72 hours
 * Saves filtered data to fixtures.json with timestamp
 */

// Get API key from environment variable
const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
    console.error('Error: API_FOOTBALL_KEY environment variable is required');
    process.exit(1);
}

// Calculate date range (next 72 hours)
const now = new Date();
const endDate = new Date(now.getTime() + (72 * 60 * 60 * 1000));

const formatDate = (date) => date.toISOString().split('T')[0];

/**
 * Make HTTPS request to API-Football
 */
function fetchFixtures() {
    const options = {
        hostname: 'v3.football.api-sports.io',
        path: `/fixtures?from=${formatDate(now)}&to=${formatDate(endDate)}`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'v3.football.api-sports.io'
        }
    };

    console.log('Fetching fixtures from API-Football...');

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                
                if (response.errors && response.errors.length > 0) {
                    console.error('API Error:', response.errors);
                    process.exit(1);
                }

                processFixtures(response.response || []);
            } catch (error) {
                console.error('Error parsing API response:', error.message);
                process.exit(1);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error.message);
        process.exit(1);
    });

    req.end();
}

/**
 * Process API response and extract essential information
 */
function processFixtures(fixtures) {
    console.log(`Processing ${fixtures.length} fixtures...`);

    // Filter out matches that have already started
    const upcomingFixtures = fixtures.filter(fixture => {
        const kickoffTime = new Date(fixture.fixture.date);
        return kickoffTime > now;
    });

    // Extract essential information
    const processedFixtures = upcomingFixtures.map(fixture => ({
        matchId: fixture.fixture.id,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        league: fixture.league.name,
        country: fixture.league.country,
        kickoffTime: fixture.fixture.date,
        homeTeamId: fixture.teams.home.id,
        awayTeamId: fixture.teams.away.id,
        leagueId: fixture.league.id
    }));

    // Create final JSON structure with timestamp
    const output = {
        lastUpdated: now.toISOString(),
        totalFixtures: processedFixtures.length,
        dateRange: {
            from: formatDate(now),
            to: formatDate(endDate)
        },
        fixtures: processedFixtures
    };

    saveToFile(output);
}

/**
 * Save filtered data to local JSON file
 */
function saveToFile(data) {
    const filename = 'fixtures.json';
    
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`✅ Successfully saved ${data.totalFixtures} fixtures to ${filename}`);
        console.log(`📅 Date range: ${data.dateRange.from} to ${data.dateRange.to}`);
        console.log(`🕒 Last updated: ${data.lastUpdated}`);
    } catch (error) {
        console.error('Error saving file:', error.message);
        process.exit(1);
    }
}

// Execute the script
fetchFixtures();