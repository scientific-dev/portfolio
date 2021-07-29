<script>
	import { afterUpdate } from 'svelte';
	import Projects from './projects';

	const ABOUT_ME_CONTENT = 'I started programming and making web apps in 2018 with python then learnt Node.js and Typescript then slowly started learning web frameworks such as React, Next.js, Svelte and then programming languages such as Rust, Golang, etc!\nI love making web apps so i always work on web application projects! I rarely make softwares and mobile apps. I animate and draw when i am at the peak of my boredom.';
	const TITLES = ['A Developer', 'An Animator', ' A Youtuber'];
	const DEVICONS = ['rust-plain', 'go-original', 'javascript-plain', 'python-original', 'html5-original', 'css3-original', 'bash-original'];
	const SOCIAL_LINKS = [
		{ name: 'youtube', url: 'https://www.youtube.com/channel/UCu6B4Z62fiCT_mwwHlc84iQ', color: 'ff0000' },
		{ name: 'github', url: 'https://github.com/Scientific-Guy', color: '211f1f' },
		{ name: 'twitter', url: 'https://twitter.com/ScientificDev', color: '1da1f2' },
		{ name: 'discord', url: 'https://discord.gg/FrduEZd', color: '7298da' }
	];

	let projects = Projects.slice(0, 6);
	let title = 'A Developer';
	let scrolledHeader = false;
	let elementState = { 
		projectCards: [], 
		aboutContentViewed: false,
		wdikContentViewed: false
	};

	afterUpdate(() => {
		elementState.projectCards = document.querySelectorAll('.opacity-0');
		checkProjectCardAnimation();
	});

	function scrollNavigationHandler(id) {
		return () => {
			let top = (document.getElementById(id).getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 100;
			window.scrollTo({ top, behavior: 'smooth' });
		};
	}

	function sleep(ms) {
		return new Promise(r => setTimeout(r, ms));
	}

	function checkProjectCardAnimation() {
		for (var i = 0; i < elementState.projectCards.length; i++) {
			var element = elementState.projectCards[i];
			var { top, bottom } = element.getBoundingClientRect();
			if (top - window.innerHeight <= 0 && bottom - window.innerHeight <= 0) 
			    element.classList.remove('opacity-0')
		}
	}

	async function checkAboutContentAnimation() {
		if (!elementState.aboutContentViewed) {
			var aboutContentElement = document.getElementById('abt-content');
			var { top, bottom } = aboutContentElement.getBoundingClientRect();
			
			if (top - window.innerHeight <= 0 && bottom - window.innerHeight <= 0) {
				elementState.aboutContentViewed = true;
				const write = async (content) => {
			        let characters = content.split('');
					for (let i = 0; i < characters.length; i++) {
	        		    await sleep(50);
	     	    	    aboutContentElement.innerHTML += characters[i];
		        	}
		        };

		        await write(ABOUT_ME_CONTENT);
		        aboutContentElement.innerHTML += '<br/><br/><span>Warning: </span>';
		        await write('The avatar which is been used here is made by me so kindly contact me before using it.');
			}
		}
	}

	async function checkWDIKContentAnimation() {
		if (!elementState.wdikContentViewed) {
			var wdikContentElement = document.getElementById('wdik');
			var { top, bottom } = wdikContentElement.getBoundingClientRect();
			if (top - window.innerHeight <= 0 && bottom - window.innerHeight <= 0) {
				elementState.wdikContentViewed = true;
				
				var deviconElements = document.querySelectorAll('.wdik img');
				for (let i = 0; i < deviconElements.length; i++) {
					await sleep(250);
					deviconElements[i].classList.remove('diminished-devicon');
				}
			}
		}
	}

	window.addEventListener('load', () => {
		const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		scrolledHeader = scrolled > 20;
	});

	window.addEventListener('resize', () => {
		elementState.projectCards = document.querySelectorAll('.project-card');
		checkProjectCardAnimation();
		checkAboutContentAnimation();
		checkWDIKContentAnimation();
	});

	window.addEventListener('scroll', () => {
		const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		scrolledHeader = scrolled > 20;
		checkProjectCardAnimation();
		checkAboutContentAnimation();
		checkWDIKContentAnimation();
	});

	setInterval(() => title = TITLES[Math.floor(Math.random() * TITLES.length)], 50000);
</script>

<div class="background"></div>

<div class={`header ${scrolledHeader ? 'scrolled-header' : ''}`}>
	<span style="display: inline-block;"><h2>Scientific Guy</h2></span>
	<span class="buttons">
		<button on:click={() => window.scrollTo({ top: 0, behaviour: 'smooth' })}>Home</button>
		<button on:click={scrollNavigationHandler('abt-me')}>About</button>
		<button on:click={scrollNavigationHandler('projects')}>Projects</button>
	</span>
</div>

<div class="cover">
	<div class="content">
		<h1>Scientific Guy</h1>
		<p>{title}</p>
		<p>I am a high school student who likes to do programming and stuff. I am a full stack developer and I mostly build user interfaces with the prominent programming language as Javascript.</p>
	</div>

	<div class="socialcards">
		{#each SOCIAL_LINKS as link}
		    <a style={`background-color: #${link.color};`} class={`socialcard social-${link.name}`} href={link.url}>
				<i class={`fab fa-${link.name}`}/>
			</a>
		{/each}
	</div>
</div>

<div class="rest-body">
	<div class="section abt-me" id="abt-me">
        <span class="section-title"><span>01.</span> About me</span>
        <div class="section-content">
			<div>
				<div><img class="pfp" src="/branding96.png" alt="Scientific Guy"></div>
			</div>

			<div>
				<span>Name: </span> Scientific Guy (Not real name though)<br/>
				<span>Mail: </span> scientificguy007@gmail.com<br/>
				<span>Aka: </span> NO U, Science Spot<br/>
				<span>Location: </span> <img class="in-flag" src="https://lipis.github.io/flag-icon-css/flags/4x3/in.svg" alt="Indian Flag"> India<br/>
				<span>Favourite Languages: </span> Javascript, Rust and Golang<br/><br/>

				<p id="abt-content" style="display: inline-block; margin: 0;"></p>
			</div>
		</div>
    </div>

	<div class="section wdik" style="margin-top: 20px;" id="wdik">
        <span class="section-title"><span>02.</span> What do i know?</span>
        <div class="section-content" style="margin-top: 10px;">
			{#each DEVICONS as icon}
			    <img src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/${icon.split('-')[0]}/${icon}.svg`} alt={icon.split('-')[0]} draggable="false" style="cursor: pointer;" class="diminished-devicon"/>
			{/each}
		</div>
    </div>

	<div class="section projects" style="margin-top: 20px;" id="projects">
        <span class="section-title"><span>03.</span> Projects</span>
        <div class="section-content" style="margin-top: 10px;">
			{#each projects as project}
			    <div class="project-card opacity-0">
                    <div class="svg-row">
                        <i class="far fa-folder-open fa-2x"/>
                        <span style="float: right;">
                            <a href={project.link}><i class="fas fa-external-link-alt"/></a>
							{#each project.buttons as button}
							    <a href={button.href}><i class={button.svg}/></a>
							{/each}
                        </span>
                    </div>

                    <h2>{project.name}</h2>
                    <p class="description">{project.description}</p>

					<span style="display: inline-block; margin-left: -2px; margin-bottom: -10px;">
						{#each project.languages as language}
					        <p class="lang">{language}</p>
				    	{/each}
					</span>
                </div>
			{/each}
		</div>

		<p 
		    style="font-family: Changa; color: white; font-size: 18px; cursor: pointer;"
		    on:click={() => projects = projects.length <= 6 ? Projects : Projects.slice(0, 6)}
		>
		    Show {projects.length <= 6 ? 'more' : 'less'} projects?
		</p>
    </div>
</div>

<div class="footer">© Scientific-Guy 2021</div>