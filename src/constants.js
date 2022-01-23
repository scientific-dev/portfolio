const SVG = {
    GitHub: 'fab fa-github',
    NPM: 'fab fa-npm',
    Docs: 'fas fa-book',
    Link: 'fas fa-link',
    Deno: 'fas fa-archive'
}

function makeBtn(href, name){
    return { name, href, svg: SVG[name] };
}

export const ThingsIKnow = [['javascript', 'plain'], ['go', 'original'], ['python', 'original'], ['html5', 'original'], ['css3', 'original'], ['rust', 'plain']]

export const SocialLinks = [
    // { name: 'youtube', url: 'https://www.youtube.com/channel/UCu6B4Z62fiCT_mwwHlc84iQ', color: 'ff0000' },
    { name: 'github', url: 'https://github.com/scientific-dev', color: '211f1f' },
    { name: 'twitter', url: 'https://twitter.com/ScientificDev', color: '1da1f2' },
    { name: 'discord', url: 'https://discord.gg/FrduEZd', color: '7298da' }
];

export const Projects = [
    {
        name: 'Spotify-api.js',
        description: 'A npm package to interact with spotify api with node.js with oauth support. This package also supports caching!',
        languages: ['Typescript', 'Javascript'],
        link: 'https://npmjs.com/package/spotify-api.js',
        buttons: [
            makeBtn('https://github.com/spotify-api/spotify-api.js', 'GitHub'),
            makeBtn('https://npmjs.com/package/spotify-api.js', 'NPM')
        ]
    },
    {
        name: 'Enhanced.db',
        description: 'A npm package which is a wrapper for better-sqlite3! Currently not maintained...',
        languages: ['Javascript'],
        link: 'https://npmjs.com/package/enhanced.db',
        buttons: [
            makeBtn('https://github.com/Scientific-Dev/enhanced.db', 'GitHub'),
            makeBtn('https://npmjs.com/package/enhanced.db', 'Link')
        ]
    },
    {
        name: 'Instant.db',
        description: 'Instant.db helps you to make database instantly using json files for Node.js!',
        languages: ['Javascript'],
        link: 'https://npmjs.com/package/instant.db',
        buttons: [
            makeBtn('https://github.com/Scientific-Dev/instant.db', 'GitHub'),
            makeBtn('https://npmjs.com/package/instant.db', 'Link')
        ]
    },
    {
        name: 'TimelineOfIndia',
        description: 'Timeline of India is a website which shows the events from the very first of the Indus civilization of the Indian subcontinent to the current state of the Indian subcontinent.',
        languages: ['Svelte', 'Javascript'],
        link: 'https://timelineofindia.github.io',
        buttons: [
            makeBtn('https://github.com/timelineofindia', 'GitHub')
        ]
    },
    {
        name: 'Templatify',
        description: 'A cli to create local templates and copy templates from github which is saved within your pc and used easily!',
        languages: ['Go'],
        link: 'https://github.com/Scientific-Dev/templatify',
        buttons: [
            makeBtn('https://github.com/Scientific-Dev/templatify', 'GitHub')
        ]
    },
    {
        name: 'EvtManager',
        description: 'Simple to use eventemitter to manage your events synchronously and asynchronously too for Deno, Node and browser with a typesafe environment!',
        link: 'https://github.com/scientific-dev/evtmanager',
        languages: ['Javascript', 'Typescript'],
        buttons: [
            makeBtn('https://github.com/scientific-dev/evtmanager', 'GitHub'),
            makeBtn('https://npmjs.com/package/evtmanager', 'NPM'),
            makeBtn('https://deno.land/x/evtmanager', 'Deno')
        ]
    },
    {
        name: 'Emoji Canvas',
        description: 'An easy to use module to write text with parsed emojis (supports discord emojis too) in canvas for deno!',
        languages: ['Javascript', 'Typescript'],
        link: 'https://github.com/Scientific-Dev/emoji-canvas',
        buttons: [
            makeBtn('https://github.com/Scientific-Dev/emoji-canvas', 'GitHub'),
            makeBtn('deno.land/x/emoji_canvas', 'Deno')
        ]
    },
    {
        name: 'Deno Headers Socket',
        description: 'A custom socket for deno to add custom headers which lacks in the standard library!',
        link: 'https://github.com/scientific-dev/custom-socket',
        languages: ['Javascript', 'Typescript'],
        buttons: [
            makeBtn('https://github.com/scientific-dev/custom-socket', 'GitHub'),
            makeBtn('https://deno.land/x/custom_socket', 'Deno')
        ]
    },
    {
        name: 'Ludo',
        description: 'An awesome site to play singleplayer ludo for fun even with bots!',
        link: 'https://scientific-dev.github.io/ludo?game',
        languages: ['Svelte', 'Javascript'],
        buttons: [
            makeBtn('https://github.com/scientific-dev/ludo', 'GitHub')
        ]
    }
];