import React from 'react';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout title="Home" description="Basic Formal Ontology (BFO)">
      <main className="container padding-vert--lg">
        <h1>Welcome to BFO</h1>
        <p>
          The <strong>Basic Formal Ontology (BFO)</strong> is a small, upper level ontology designed
          to support information retrieval, analysis, and integration in scientific and other domains.
          BFO is a genuine upper ontology. It does not contain physical, chemical, biological, or other terms
          that would fall within the special sciences. It is used by more than 550 ontology-driven projects
          worldwide.
        </p>
        <p>
          The BFO project was initiated in 2002 under the auspices of the project <em>Forms of Life</em>,
          sponsored by the{' '}
          <a href="https://www.volkswagenstiftung.de/en/funding/key-results-from-the-humanities/forms-of-life.html">
            Volkswagen Foundation
          </a>.
        </p>
        <p>
          The theory behind BFO was developed first by{' '}
          <a href="http://ontology.buffalo.edu/smith/">Barry Smith</a> and{' '}
          <a href="http://www.uni-saarland.de/~pgrenon">Pierre Grenon</a> and presented in a series of
          publications listed <a href="/publications.html">here</a>.
        </p>
        <p>
          Since then, major contributions have been made above all by{' '}
          <a href="http://sciencecommons.org/about/whoweare/ruttenberg/">Alan Ruttenberg</a>.
        </p>
      </main>
    </Layout>
  );
}
