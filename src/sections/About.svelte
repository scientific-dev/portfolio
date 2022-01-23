<script>
    import { ThingsIKnow } from "../constants";
</script>

<div class="about-flex">
    <div>
        <div style="padding-right: 20px;">
            <div class="pfp"/>
        </div>
    </div>

    <div class="text">
        Hi, I'm <strong>Sudarsan</strong>. I am a full stack web developer with <strong>TheSudarsanDev</strong> (abbrv. The Sudarsan Developer) as my internet username.<br/><br/>
        I am a high school student from <strong>India</strong> who started programming with <strong>Python</strong> in <strong>2018</strong> then consequently started with web development with <strong>Javascript</strong> and then started to learn programming languages such as 
        <strong>Golang</strong>, <strong>Rust</strong> and learning more. And i draw and animate rarely and one of the creation is my avatar.<br/><br/>
        Things i know:<br/>

        <div style="display: flex; flex-wrap: wrap; margin-top: 6px;">
            {#each ThingsIKnow as thing}
                <img 
                    src="https://raw.githubusercontent.com/devicons/devicon/master/icons/{thing[0]}/{thing[0]}-{thing[1]}.svg"
                    draggable="false" 
                    alt={thing[0]} 
                    width=30 
                    height=30
                    style="cursor: pointer;"
                />
            {/each}
        </div>

        <div style="height: 80px;"></div>
    </div>
</div>

<style>
    .pfp {
	    width: 300px;
	    height: 300px;
    	border-radius: 6px;
	    cursor: pointer;
	    background: var(--blue) url(/branding96.png) no-repeat;
	    background-blend-mode: luminosity;
	    background-size: cover;
    	opacity: .85;
    }

    .pfp::after {
	    content: "";
	    display: block;
	    border: 3px solid var(--blue);
	    width: 300px;
	    height: 300px;
    	border-radius: 6px;
	    position: relative;
    	top: 15px;
	    left: 15px;
    }

    .pfp:hover, .pfp:focus {
	    background-color: transparent;
	    opacity: 1;
    }

    .pfp:hover::after, .pfp:focus::after {
        top: 0;
        left: 0;
    }

    .text {
        opacity: .85;
	    font-size: 18px;
	    line-height: 1.3;
    	margin-top: 30px;
    }

    .text strong {
	    font-weight: lighter;
	    color: var(--lighter-blue);
	    opacity: 1!important;
    }

    @media (max-width: 600px) {
        .text {
		    margin-top: 50px;
	    }

        .pfp, .pfp::after {
		    width: calc(86vw - 20px);
		    height: calc(86vw - 20px);
	    }

	    .pfp:hover, .pfp:focus,
	    .pfp:hover::after,
	    .pfp:focus::after {
            width: calc(86vw - 10px);
		    height: 86vw;
	    }
    }

    @media (min-width: 600px) {
	    .about-flex {
		    display: flex;
		    flex-wrap: nowrap;
	    }

	    .text {
		    margin-left: 20px;
	    }
    }
</style>