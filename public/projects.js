const svgs = {
    GitHub: 'fab fa-github',
    NPM: 'fab fa-npm',
    Docs: 'fas fa-book',
    Link: 'fas fa-link'
}

function makeBtn(href, name){
    return { name, href, svg: svgs[name] };
}

window.projects = [
    {
        name: 'Spotify-api.js',
        description: 'A npm package to interact with spotify api with node.js with oauth support. This package also supports caching!',
        languages: ['Typescript', 'Javascript'],
        link: 'https://npmjs.com/package/spotify-api.js',
        buttons: [
            makeBtn('https://github.com/spotify-api/spotify-api.js', 'GitHub'),
            makeBtn('https://npmjs.com/package/spotify-api.js', 'NPM'),
            makeBtn('https://spotify-api.js.org', 'Docs')
        ]
    },
    {
        name: 'Botlist',
        description: 'A very basic discord botlist made with react! Currently functional and maintained too...',
        languages: ['React', 'Javascript'],
        link: 'https://botlist.decimaldev.xyz',
        buttons: [
            makeBtn('https://github.com/decimaldevteam/botlist', 'GitHub'),
            makeBtn('https://botlist.decimaldev.xyz', 'Link')
        ]
    },
    {
        name: 'Guides',
        description: 'A very basic guides website for developer by developers made with react with many features!',
        languages: ['React', 'Next.js', 'Javascript'],
        link: 'https://guides.decimaldev.xyz',
        buttons: [
            makeBtn('https://github.com/decimaldevteam/guides', 'GitHub'),
            makeBtn('https://guides.decimaldev.xyz', 'Link')
        ]
    },
    {
        name: 'Node-set-theory',
        description: 'A npm package to make set calculation with nodejs javascript and typescript!',
        languages: ['Typescript', 'Javascript'],
        link: 'https://npmjs.com/package/node-set-theory',
        buttons: [
            makeBtn('https://github.com/Scientific-Guy/node-set-theory', 'GitHub'),
            makeBtn('https://npmjs.com/package/node-set-theory', 'NPM'),
            makeBtn('https://npmjs.com/package/node-set-theory', 'Docs')
        ]
    },
    {
        name: 'GitHubStats',
        description: 'A website which says the stats of your github profile or organization!',
        languages: ['Html', 'CSS', 'Javascript', 'Chart.js'],
        link: 'https://githubstats.decimaldev.xyz',
        buttons: [
            makeBtn('https://github.com/decimaldevteam/githubstats', 'GitHub'),
            makeBtn('https://githubstats.decimaldev.xyz', 'Link')
        ]
    },
    {
        name: 'Enhanced.db',
        description: 'A npm package which is a wrapper for better-sqlite3! Currently not maintained...',
        languages: ['Javascript'],
        link: 'https://npmjs.com/package/enhanced.db',
        buttons: [
            makeBtn('https://github.com/Scientific-Guy/enhanced.db', 'GitHub'),
            makeBtn('https://npmjs.com/package/enhanced.db', 'Link')
        ]
    },
    {
        name: 'Instant.db',
        description: 'Make database instantly using json files!',
        languages: ['React', 'Next.js', 'Javascript'],
        link: 'https://npmjs.com/package/instant.db',
        buttons: [
            makeBtn('https://github.com/Scientific-Guy/instant.db', 'GitHub'),
            makeBtn('https://npmjs.com/package/instant.db', 'Link')
        ]
    },
    {
        name: 'Chat',
        description: 'A socket.io chat website made with next.js',
        languages: ['React', 'Next.js', 'Javascript', 'Socket.io'],
        link: 'https://chat.decimaldev.xyz',
        buttons: [
            makeBtn('https://chat.decimaldev.xyz', 'Link')
        ]
    }
]