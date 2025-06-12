// Dummy data for development
export const dummyAccounts = [
    {
        username: 'demo',
        password: 'demo123',
        email: 'demo@example.com',
        profilePic: './assets/guestPfp.png',
        bio: 'This is a demo account for testing purposes.'
    },
    {
        username: 'user1',
        password: 'pass123',
        email: 'user1@example.com',
        profilePic: './assets/guestPfp.png',
        bio: 'Photography enthusiast'
    }
];

export const dummyPhotos = [
    {
        id: 1,
        url: 'https://picsum.photos/id/1/400/400',
        owner: 'demo',
        access: 'PUBLIC',
        label: 'Nature View',
        hashtags: ['nature', 'landscape'],
        hasEdits: false
    },
    {
        id: 2,
        url: 'https://picsum.photos/id/20/400/400',
        owner: 'demo',
        access: 'FRIENDS',
        label: 'City Lights',
        hashtags: ['city', 'night'],
        hasEdits: true
    },
    {
        id: 3,
        url: 'https://picsum.photos/id/30/400/400',
        owner: 'demo',
        access: 'PRIVATE',
        label: 'Personal Photo',
        hashtags: ['personal'],
        hasEdits: false
    },
    {
        id: 4,
        url: 'https://picsum.photos/id/40/400/400',
        owner: 'user1',
        access: 'PUBLIC',
        label: 'Beach Day',
        hashtags: ['beach', 'summer'],
        hasEdits: false
    }
];