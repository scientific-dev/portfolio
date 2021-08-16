<script>
	import { SocialLinks, ThingsIKnow, Projects } from './constants';

	let scrolledHeader = false;
	let displayAbout = false;
	let displayProjects = false;

	Element.prototype.inViewport = function () {
		var { top, bottom } = this.getBoundingClientRect();
		var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		return top - windowHeight <= 0 && bottom - windowHeight <= 0;
	}

	Element.prototype.hasPartInViewport = function () {
		var { top, height } = this.getBoundingClientRect();
		return (top + (height / 3)) <= (window.innerHeight || document.documentElement.clientHeight);
	} 

	function sleep(ms) {
		return new Promise(r => setTimeout(r, ms));
	}

	function scrollNavigationHandler(id) {
		return () => {
			let top = (document.getElementById(id).getBoundingClientRect().top - document.body.getBoundingClientRect().top);
			window.scrollTo({ top, behavior: 'smooth' });
		};
	}

	function checkHeaderScrolled() {
		const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		scrolledHeader = scrolled > 20;
	}

	async function checkSections() {
		if (!displayAbout && document.getElementById('about').hasPartInViewport()) displayAbout = true;
		if (!displayProjects && document.getElementById('projects').hasPartInViewport()) displayProjects = true;

		let projectCardElements = document.querySelectorAll('.pre-project-card');
		for (let i = 0; i < projectCardElements.length; i++) {
			if (projectCardElements[i].inViewport()) {
				projectCardElements[i].classList.remove('pre-project-card');
				await sleep(1000);
			}
		}
	}

	async function animateIntroPage() {
		let intoContentElements = document.querySelectorAll('.pre-intro-content');
		for (let i = 0; i < intoContentElements.length; i++) {
			await sleep(200);
			intoContentElements[i].classList.remove('pre-intro-content');
		}

		await sleep(600);
		let socialCardElements = document.querySelectorAll('.pre-socialcard');
		for (let i = 0; i < socialCardElements.length; i++) {
			await sleep(200);
			socialCardElements[i].classList.remove('pre-socialcard');
		}
	}

	window.addEventListener('load', async () => {
		let headerContentElements = document.querySelectorAll('.pre-header-content');
		for (let i = headerContentElements.length - 1; i >= 0; i--) {
			headerContentElements[i].classList.remove('pre-header-content');
			await sleep(200);
		}

		animateIntroPage();
		checkSections();
		checkHeaderScrolled();
	});

	window.addEventListener('scroll', () => {
		checkSections();
		checkHeaderScrolled();
	});

	window.addEventListener('resize', () => {
		checkSections();
		checkHeaderScrolled();
	});
</script>

<div class="background"></div>

<div class={`header ${scrolledHeader ? 'scrolled-header' : ''}`}>
	<span class="pre-header-content" style="display: inline-block;"><h2>Scientific Dev</h2></span>
	<span class="buttons">
		<button class="pre-header-content" on:click={() => window.scrollTo({ top: 0, behaviour: 'smooth' })}>Home</button>
		<button class="pre-header-content" on:click={scrollNavigationHandler('about')}>About</button>
		<button class="pre-header-content" on:click={scrollNavigationHandler('projects')}>Projects</button>
	</span>
</div>

<div class="intro" id="intro">
	<div class="content">
		<h1 class="pre-intro-content">Scientific Dev</h1>
	    <h2 class="pre-intro-content">Yet Another Random Developer</h2>
	    <p class="pre-intro-content">I am a high school student who likes to do programming and stuff. I am a full stack developer and i mostly build user interfaces with the prominent programming language as Javascript.</p>
	</div> 

	<div class="socialcards">
		{#each SocialLinks as link}
		    <a style={`--color: #${link.color};`} class={`pre-socialcard socialcard social-${link.name}`} href={link.url}>
				<i class={`fab fa-${link.name}`}/>
			</a>
		{/each}
	</div>
</div>

<div class="about" id="about">
	{#if displayAbout}
	    <div class="section-inner">
			<h1 class="section-title"><span>01.</span> About me</h1>
			<div class="about-flex">
				<div>
					<div style="padding-right: 20px;">
						<div class="pfp"></div>
					</div>
				</div>
				<div class="text">
					Hi. I am a full stack web developer with <strong>Scientific Dev</strong> as my internet username.<br/><br/>
					I am a high school student from <strong>India</strong> who started programming with <strong>Python</strong> in <strong>2018</strong> then consequently started with web development with <strong>Javascript</strong> and then started to learn programming languages such as 
					<strong>Golang</strong>, <strong>Rust</strong> and learning more. And i draw and animate rarely and one of the creation is my avatar.<br/><br/>
					Things i know:<br/>

					<div style="display: flex; flex-wrap: wrap; margin-top: 6px;">
						{#each ThingsIKnow as thing}
					        <img 
							    src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/${thing[0]}/${thing[0]}-${thing[1]}.svg`} 
								draggable="false" 
								alt={thing[0]} 
								width="30" 
								height="30" 
								style="cursor: pointer;"
							/>
						{/each}
					</div>

					<div style="height: 80px;"></div>
				</div>
			</div>
		</div>
	{/if}
</div>

<div class="projects" id="projects">
	{#if displayProjects}
	    <div class="section-inner">
			<h1 class="section-title"><span>02.</span> Projects</h1>
			<div class="project-list">
				{#each Projects as project}
					<div class="project-card pre-project-card">
						<header>
							<div class="title">
								<i class="far fa-folder-open fa-2x"/>
								<h3>{project.name}</h3>
							</div>

							<p class="description">{project.description}</p>
							<div style="height: 10px;"></div>
						</header>

						<footer>
							<span class="languages">
								{#each project.languages as language}
									<p>{language}</p>
								{/each}
							</span>

							<span class="svg-links">
								{#each project.buttons as button}
								    <a href={button.href}>
										<i class={button.svg}/>
									</a>
								{/each}
							</span>
						</footer>
					</div>
			    {/each}
			</div>
		</div>
	{/if}
</div>

<div class="footer">© Scientific-Dev 2021</div>