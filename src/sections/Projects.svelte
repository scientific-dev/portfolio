<script>
	import Project from '../components/Project.svelte';
	import { Projects } from '../scripts/constants';

	let displayAll = false;
</script>

<div class="project-list flex flex-wrap">
	{#each Projects.slice(0, displayAll ? Projects.length : 6) as project}
		<Project {project}/>
	{/each}
</div>

<p 
	class="cursor-pointer project-card pre-project-card"
	on:click={() => displayAll = !displayAll}
>
	View {displayAll ? 'less' : 'all'} projects?
</p>

<style>
	p {
		margin-top: 10px;
		font-size: 20px;
		text-align: center;
		display: lock;
	}

	p:hover {
		opacity: .85;
	}

	@media (min-width: 1200px) {
		.project-list {
			--card-flex: 25%!important;
			--card-count: 3!important;
		}
	}

	@media (min-width: 800px) {
		.project-list {
			--card-flex: 40%;
			--card-count: 2;
			margin-left: calc(50% - (var(--card-count) / 2) * (var(--card-flex) + 60px));
		}
	}
</style>