<script>
	import Header from './components/Header.svelte';
	import Intro from './components/Intro.svelte';
	import Section from './components/Section.svelte';
	import About from './sections/About.svelte';
	import Projects from './sections/Projects.svelte';
	import Timeline from './sections/Timeline.svelte';
	import './styles/global.css';

	const SECTIONS = ['about', 'projects', 'timeline'];

	let scrolledHeader = false;
	let displayStates = { about: false, projects: false };

	Element.prototype.inViewport = function () {
		var { top, bottom } = this.getBoundingClientRect();
		var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		return top - windowHeight <= 0 && bottom - windowHeight <= 0;
	}

	Element.prototype.hasPartInViewport = function () {
		var { top, height } = this.getBoundingClientRect();
		return (top + (height / 3)) <= (window.innerHeight || document.documentElement.clientHeight);
	} 

	Element.prototype.almostInViewport = function () {
		var { top, height } = this.getBoundingClientRect();
		return (top + (height / 1.5)) <= (window.innerHeight || document.documentElement.clientHeight);
	} 

	function sleep (ms) {
		return new Promise(r => setTimeout(r, ms));
	}
	
	function headerScrolled () {
		scrolledHeader = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 20;
	}

	async function checkPreElements (className, type) {
		let preElements = document.querySelectorAll(`.${className}`);
		for (let i = 0; i < preElements.length; i++) {
			if (preElements[i][type]()) {
				preElements[i].classList.remove(className);
				await sleep(1000);
			}
		}
	}

	async function checkSections () {
		for (let i = 0; i < SECTIONS.length; i++) {
			let id = SECTIONS[i];
			if (!displayStates[id] && document.getElementById(id).hasPartInViewport())
				displayStates = Object.defineProperty(displayStates, id, { value: true });
		}
		
		checkPreElements('pre-project-card', 'inViewport');
		checkPreElements('pre-activity', 'almostInViewport');
	}

	async function animateIntroPage () {
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

	const onRefresh = () => {
		checkSections();
		headerScrolled();
	};

	window.addEventListener('load', async () => {
		let headerContentElements = document.querySelectorAll('.pre-header-content');
		for (let i = headerContentElements.length - 1; i >= 0; i--) {
			headerContentElements[i].classList.remove('pre-header-content');
			await sleep(200);
		}

		animateIntroPage();
		checkSections();
		headerScrolled();
	});

	window.addEventListener('scroll', onRefresh);
	window.addEventListener('resize', onRefresh);
</script>

<div class="background position-fixed"/>

<Header {scrolledHeader}/>
<Intro/>

<Section
	i=1
	id="about"
	name="About me"
	display={displayStates.about}
>
	<About/>
</Section>

<Section
	i=2
	id="projects"
	name="Projects"
	display={displayStates.projects}
>
	<Projects/>
</Section>

<Section
	i=3
	id="timeline"
	name="Timeline"
	display={displayStates.timeline}
>
	<Timeline/>
</Section>

<div class="footer text-white font-changa">© TheSudarsanDev {new Date().getFullYear()}</div>

<style>
	.background {
		width: 100vw;
		height: 100vh;
		background: #252931 url(/scenary.jpg) no-repeat;
		background-size: cover;
		background-blend-mode: multiply;
	}

	.footer {
		position: relative; 
		width: 100%;
		padding: 10px 0;
		font-size: 20px;
		text-align: center;
	}
</style>