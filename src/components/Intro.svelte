<script>
	import { SocialLinks } from "../scripts/constants";
</script>

<div class="intro text-white font-changa flex" id="intro">
	<div class="content">
		<h1 class="pre-intro-content">TheSudarsanDev</h1>
		<h2 class="pre-intro-content">Yet Another Random Developer</h2>
		<p class="pre-intro-content">I'm Sudarsan, a high school student who likes to do programming and stuff. I am a full stack developer and i mostly build user interfaces with the prominent programming language as Javascript.</p>
	</div> 

	<div class="socialcards">
		{#each SocialLinks as link}
			<a 
				style="--color: #{link.color};" 
				class="pre-socialcard socialcard social-{link.name} cursor-pointer" 
				href={link.url}
			>
				<i class="fab fa-{link.name}"/>
			</a>
		{/each}
	</div>
</div>

<style>
	.intro {
		position: relative;
		margin: auto;
		min-height: 100vh;
		align-items: flex-start;
		justify-content: center;
		flex-direction: column;
		width: 85vw;
	}

	h1, h2 {
		margin: 0;
		line-height: 1;
	}

	h1 {
		font-size: clamp(40px, 8vw, 74px);
	}

	h2 {
		margin-top: 10px;
		font-size: clamp(30px, 4vw, 80px);
		opacity: .85;
	}

	p {
		margin-top: 20px;
		line-height: 1.2;
		letter-spacing: 1.3px;
		width: 70%;
		font-size: 20px;
		opacity: .8;
		display: block;
	}

	.socialcards {
		margin-left: -12px;
	}

	.socialcard {
		color: white;
		border-radius: 100%;
		width: 40px;
		height: 40px;
		margin-bottom: 10px;
		margin-left: 12px;
		text-decoration: none;
		display: inline-block;
		background-color: var(--color);
	}

	.socialcard:hover {
		background-color: white;
	}

	:global(.pre-intro-content),
	:global(.pre-socialcard) {
		opacity: 0!important;
	}

	:global(.intro .content *:not(.pre-intro-content)) {
		animation: intro-content-animation 1s forwards;
	}

	:global(.socialcard:hover svg) {
		color: var(--color);
	}

	:global(.socialcard svg) {
		display: inline-block;
		margin: 12px;
	}

	:global(.social-youtube svg) {
		margin: 11px;
	}

	:global(.socialcard:not(.pre-socialcard)) {
		animation: socialcard-animation 1s forwards;
	}

	@media (max-height: 450px) {
		.intro {
			margin-top: 80px;
			width: calc(100vh - 80px);
		}
	}

	@media (max-width: 1024px) {
		.intro { width: 80vw; }
		p { font-size: 16px; }
	}

	@media (max-width: 500px) {
		.intro { width: 85vw; }
		p { width: 100%; }
	}
</style>