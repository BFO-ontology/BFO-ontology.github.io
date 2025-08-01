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
          <a href="https://www.volkswagenstiftung.de/en/foundation/about-us" target="_blank" rel="noopener noreferrer">
            Volkswagen Foundation
          </a>.
        </p>

        <p>
          The theory behind BFO was developed first by{' '}
          <a href="http://ontology.buffalo.edu/smith/" target="_blank" rel="noopener noreferrer">Barry Smith</a> and{' '}
          <a href="https://uk.linkedin.com/in/pierregrenon" target="_blank" rel="noopener noreferrer">Pierre Grenon</a> and presented in a series of
          publications listed <a href="/publications">here</a>.
        </p>

        <p>
          Since then, major contributions have been made above all by{' '}
          <a href="https://www.linkedin.com/in/alanruttenberg" target="_blank" rel="noopener noreferrer">Alan Ruttenberg</a>, also by many others, including:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.3rem 1rem',
            listStyle: 'none',
            paddingLeft: 0,
          }}
        >
          <div><a href="https://www.linkedin.com/in/mathiasbrochhausen/">Mathias Brochhausen</a></div>
          <div><a href="https://www.referent-tracking.com/RTU/ceusters_vita.html">Werner Ceusters</a></div>
          <div><a href="https://www.linkedin.com/in/mcourtot/">Melanie Courtot</a></div>
          <div><a href="https://www.buffalo.edu/cas/philosophy/faculty/memoriam/dipert.html">Randall Dipert</a></div>
          <div><a href="https://scholar.google.com/citations?user=cz-hhPUAAAAJ&hl=en">Janna Hastings</a></div>
          <div><a href="https://orcid.org/0000-0002-6601-2165">Chris Mungall</a></div>
          <div><a href="https://sapl.ucalgary.ca/about/people/fabian-neuhaus">Fabian Neuhaus</a></div>
          <div><a href="https://orcid.org/0000-0001-5809-9523">Darren Natale</a></div>
          <div><a href="https://www.jneilotte.com/">Neil Otte</a></div>
          <div><a href="http://james.overton.ca/projects">James Overton</a></div>
          <div><a href="https://orcid.org/0000-0002-8457-6693">Bjoern Peters</a></div>
          <div><a href="https://www.linkedin.com/in/ron-rudnicki-957b004/">Ron Rudnicki</a></div>
          <div><a href="https://scholar.google.com/citations?user=O2ariVIAAAAJ&hl=en">Stefan Schulz</a></div>
          <div><a href="https://seljaseppala.wordpress.com/">Selja Seppälä</a></div>
          <div><a href="https://www.linkedin.com/in/holgerstenzhorn/?locale=en_US">Holger Stenzhorn</a></div>
          <div><a href="https://www.linkedin.com/in/jie-zheng-b527a8126/">Jie Zheng</a></div>
        </div>

        <p style={{ fontSize: '1rem', marginTop: '2rem' }}>
          ...and by more than a hundred other members of the{' '}
          <a href="https://groups.google.com/g/bfo-discuss" target="_blank" rel="noopener noreferrer">
            BFO Discussion Group
          </a>.
        </p>

        <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1rem' }}>
          BFO Resources
        </h3>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'flex-start',
            marginBottom: '2rem',
          }}
        >
          <a href="https://ncorwiki.buffalo.edu/index.php/BFO_Release_History" target="_blank" rel="noopener noreferrer">
            BFO Release History
          </a>
          <a href="https://www.youtube.com/@bfovideos" target="_blank" rel="noopener noreferrer">
            BFO YouTube Channel
          </a>
          <a href="https://purl.obolibrary.org/obo/bfo/2020/bfo-pt.owl" target="_blank" rel="noopener noreferrer">
            BFO in Portuguese
          </a>
          <a href="https://mitpress.mit.edu/9780262527811/building-ontologies-with-basic-formal-ontology/" target="_blank" rel="noopener noreferrer">
            BFO Textbook Published by MIT Press
          </a>
        </div>
      </main>
    </Layout>
  );
}
