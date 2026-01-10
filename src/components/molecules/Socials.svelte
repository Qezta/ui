<script lang="ts">
  import { faLink, faEnvelope } from '@fortawesome/free-solid-svg-icons';
  import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
  import SectionHeader from '../atoms/SectionHeader.svelte';
  import Social from '../atoms/Social.svelte';
  import HuggingFaceIcon from '../atoms/icons/HuggingFaceIcon.svelte';
  import KaggleIcon from '../atoms/icons/KaggleIcon.svelte';
</script>

<section>
  <SectionHeader text="Socials" icon={faLink} />
  <ul>
    <Social faIcon={faGithub} link="https://github.com/DivitMittal" anchor="github" />
    <Social faIcon={faLinkedin} link="https://www.linkedin.com/in/divit-mittal" anchor="linkedin" />
    <Social faIcon={faTwitter} link="https://x.com/Divit_Mittal" anchor="twitter" />
    <Social link="https://huggingface.co/divitmittal" anchor="huggingface" badge="Models & Demos">
      <HuggingFaceIcon slot="icon" size="1.5rem" />
    </Social>
    <Social link="https://www.kaggle.com/divitmittal" anchor="kaggle" badge="Notebooks & Datasets">
      <KaggleIcon slot="icon" size="1.5rem" />
    </Social>
    <Social
      faIcon={faEnvelope}
      link="mailto:divitmittal@outlook.in"
      anchor="mail"
      overrideText="divitmittal@outlook.in"
      badge="work"
    />
    <Social
      faIcon={faEnvelope}
      link="mailto:64.69.76.69.74.m@gmail.com"
      anchor="mail"
      overrideText="64.69.76.69.74.m@gmail.com"
      badge="dev"
    />
  </ul>
</section>

<style lang="scss">
  section {
    min-width: 0; // Prevent flex overflow
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-top: 0.5rem;
  }

  // Mobile optimization
  @media (max-width: 505px) {
    ul {
      gap: 0.5rem;
    }
  }
</style>
