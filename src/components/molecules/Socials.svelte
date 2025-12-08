<script lang="ts">
	import { faLink, faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import { faGithub, faReddit, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
	import SectionHeader from '../atoms/SectionHeader.svelte';
	import Social from '../atoms/Social.svelte';
</script>

<section>
	<SectionHeader text="Socials" icon={faLink} />
	<ul>
		<Social faIcon={faGithub} link="https://github.com/DivitMittal" anchor="github" />
		<Social faIcon={faLinkedin} link="https://www.linkedin.com/in/divit-mittal" anchor="linkedin" />
		<Social faIcon={faTwitter} link="https://x.com/Divit_Mittal" anchor="twitter" />
		<Social faIcon={faReddit} link="https://www.reddit.com/u/divitmittal" anchor="reddit" />
		<Social
			faIcon={faEnvelope}
			link="mailto:divitmittal@outlook.in"
			anchor="mail"
			overrideText="divitmittal@outlook.in"
		/>
		<Social
			faIcon={faEnvelope}
			link="mailto:64.69.76.69.74.m@gmail.com"
			anchor="mail"
			overrideText="64.69.76.69.74.m@gmail.com"
		/>
	</ul>
</section>

<style lang="scss">
	ul {
		list-style: none;
	}
</style>