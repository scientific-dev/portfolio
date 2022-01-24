<script>
	export let project;
</script>

<div class="project-card pre-project-card flex">
	<header>
		<div class="title"> 
			<i class="far fa-folder-open fa-2x"/>
			<h3>{project.name}</h3>
		</div>

		<p class="m-0">{project.description}</p>
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
				<a href={button.href} class="cursor-pointer text-white">
					<i class={button.svg}/>
				</a>
			{/each}
		</span>
	</footer>
</div>

<style>
	.project-card {
		background-color: var(--project-color);
		border-radius: 4px;
		padding: 20px;
		margin-top: 20px;
		width: 100%;
		-webkit-box-pack: justify;
		justify-content: space-between;
		flex-direction: column;
	}

	h3 {
		font-weight: lighter;
		line-height: 0;
		font-size: 22px;
		display: inline-block;
	}

	header p {
		opacity: .8;
		line-height: 1.1;
		margin-top: 4px;
	}

	.languages {
		margin-left: -5px;
	}

	.languages p {
		margin: 0;
		margin-left: 5px;
		display: inline-block;
		opacity: .7;
		line-height: 1;
		font-family: "Titillium Web";
	}

	.svg-links {
		display: block;
		margin-left: -2px;
		margin-top: -4px;
	}

	a {
		opacity: .7;
		margin: 0;
		margin-left: 2px;
		text-decoration: none;
		font-size: 18px;
	}

	a:hover {
		opacity: 1;
	}

	:global(.project-card:not(.pre-project-card)) {
		animation: section-animation 1s forwards;
	}

	:global(.pre-project-card) {
		opacity: 0;
	}

	@media (min-width: 800px) {
		.project-card {
			flex: 0 0 var(--card-flex);
			margin-left: 20px;
		}
	}

	@media (min-width: 400px) {
		.title {
			display: flex;
			flex-wrap: nowrap;
		}
	
		:global(.project-card .title svg) {
			color: var(--blue);
		}

		h3 {
			margin-top: 16px;
			margin-left: 8px;
		}
	}

	@media (max-width: 400px) {
		:global(.project-card .title svg) {
			display: none;
		}
	}
</style>