<script lang="ts">
	import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
	import SectionHeader from '../atoms/SectionHeader.svelte';
</script>

<section>
	<SectionHeader text="About me" icon={faAddressCard} />
	<p>
		A 23-year-old data science student<br/>
    My <a href="https://europa.eu/europass/eportfolio/screen/share/33683761-9b95-4b23-8184-fa65f7a14e06?lang=en">Curriculum Vitae</a>
	</p>
</section>

<style>
	a {
		white-space: nowrap;
	}

	p {
		text-align: justify;
	}
</style>