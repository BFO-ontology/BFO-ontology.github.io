import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const userData = {
    Ontologies: [
      { name: "AERO (Adverse Event Reporting Ontology)", url: "https://bioportal.bioontology.org/ontologies/AERO" },
      { name: "Annotated BFO Ontology", url: "http://ontology.buffalo.edu/smith/articles/Annotated_BFO.pdf" },
      { name: "BCO (Biological Collections Ontology)", url: "https://github.com/BiodiversityOntologies/bco" },
      { name: "BFO-RO in Cyc", url: "http://www.cyc.com" },
      { name: "BKO (BioAssay Ontology)", url: "https://www.ebi.ac.uk/ols/ontologies/bto" },
      { name: "BONITO", url: "https://github.com/gklyne/bonito" },
      { name: "BioTopLite", url: "https://github.com/BioTop/BioTopLite" },
      { name: "CIDO (Coronavirus Infectious Disease Ontology)", url: "https://github.com/CIDO-ontology/cido" },
      { name: "COGPO (Cognitive Paradigm Ontology)", url: "https://bioportal.bioontology.org/ontologies/COGPO" },
      { name: "CRO (Contributor Role Ontology)", url: "https://casrai.org/credit/" },
      { name: "CTO (Clinical Trials Ontology)", url: "http://www.obofoundry.org/ontology/cto.html" },
      { name: "Cell Ontology", url: "http://obofoundry.org/ontology/cl.html" },
      { name: "ChEBI", url: "https://www.ebi.ac.uk/chebi/" },
      { name: "Drug Target Ontology", url: "https://drugtargetontology.org/" },
      { name: "ENVO (Environment Ontology)", url: "http://www.environmentontology.org/" },
      { name: "ERO (Eagle-i Research Resource Ontology)", url: "http://purl.obolibrary.org/obo/ero.owl" },
      { name: "ExO (Exposure Ontology)", url: "https://www.obofoundry.org/ontology/exo.html" },
      { name: "GENEPIO (Genomic Epidemiology Ontology)", url: "https://github.com/GENEPIO" },
      { name: "GENO (Genotype Ontology)", url: "https://obofoundry.org/ontology/geno.html" },
      { name: "HAO (Hymenoptera Anatomy Ontology)", url: "https://github.com/hymenoptera-ontology/hao" },
      { name: "HIO (Health Indicator Ontology)", url: "https://bioportal.bioontology.org/ontologies/HIO" },
      { name: "HL7 RIM Ontology", url: "https://bioportal.bioontology.org/ontologies/HL7" },
      { name: "IAO (Information Artifact Ontology)", url: "http://purl.obolibrary.org/obo/iao.owl" },
      { name: "IDO (Infectious Disease Ontology)", url: "http://infectiousdiseaseontology.org" },
      { name: "IDOMAL (Malaria Ontology)", url: "https://bioportal.bioontology.org/ontologies/IDOMAL" },
      { name: "IOBC (Integrated Object-Based Communication Ontology)", url: "https://github.com/IOFoundry/IOBC" },
      { name: "IRI (Image Region and Interpretation Ontology)", url: "https://bioportal.bioontology.org/ontologies/IRI" },
      { name: "IVO (Infectious Disease Vaccine Ontology)", url: "https://www.obofoundry.org/ontology/vo.html" },
      { name: "LOINC Ontology", url: "https://loinc.org/" },
      { name: "MAxO (Medical Action Ontology)", url: "https://github.com/monarch-initiative/MAxO" },
      { name: "MGED Ontology", url: "https://www.ebi.ac.uk/ols/ontologies/mged" },
      { name: "MIRO (Mosquito Insecticide Resistance Ontology)", url: "https://bioportal.bioontology.org/ontologies/MIRO" },
      { name: "NEMO (Neural ElectroMagnetic Ontologies)", url: "https://bioportal.bioontology.org/ontologies/NEMO" },
      { name: "NIFSTD", url: "https://github.com/SciCrunch/NIF-Ontology" },
      { name: "NPO (NanoParticle Ontology)", url: "https://bioportal.bioontology.org/ontologies/NPO" },
      { name: "OBI (Ontology for Biomedical Investigations)", url: "http://obi-ontology.org/" },
      { name: "OGMS (Ontology for General Medical Science)", url: "https://github.com/OGMS/ogms" },
      { name: "OntoRXN (Reaction Ontology)", url: "https://github.com/AngelRuizMoreno/OntoRXN" },
      { name: "RO (Relation Ontology)", url: "https://github.com/oborel/obo-relations" },
      { name: "SBO (Systems Biology Ontology)", url: "https://www.ebi.ac.uk/sbo/main/" },
      { name: "SEPIO (Scientific Evidence and Provenance Information Ontology)", url: "https://github.com/monarch-initiative/SEPIO-ontology" },
      { name: "SYMP (Symptom Ontology)", url: "https://www.ebi.ac.uk/ols/ontologies/symp" },
      { name: "UO (Units of Measurement Ontology)", url: "https://github.com/obophenotype/uo" },
      { name: "Uberon", url: "http://uberon.github.io/" },
      { name: "VIVO", url: "https://vivoweb.org/" },
      { name: "VO (Vaccine Ontology)", url: "http://www.violinet.org/vaccineontology/" },
      { name: "VSMO (Vector Surveillance and Management Ontology)", url: "https://www.vectorbase.org/downloads/vsmo" }
    ],
    Institutions: [
      { name: "CUNY Graduate Center", url: "https://www.gc.cuny.edu/" },
      { name: "European Bioinformatics Institute (EBI)", url: "https://www.ebi.ac.uk/" },
      { name: "Harvard University", url: "https://www.harvard.edu/" },
      { name: "Johns Hopkins University", url: "https://www.jhu.edu/" },
      { name: "Keio University", url: "https://www.keio.ac.jp/en/" },
      { name: "National Institutes of Health (NIH)", url: "https://www.nih.gov/" },
      { name: "National Library of Medicine (NLM)", url: "https://www.nlm.nih.gov/" },
      { name: "Stanford University", url: "https://www.stanford.edu/" },
      { name: "University at Buffalo", url: "https://www.buffalo.edu/" },
      { name: "University of Leipzig", url: "https://www.uni-leipzig.de/en/" },
      { name: "University of Manchester", url: "https://www.manchester.ac.uk/" },
      { name: "University of Oxford", url: "https://www.ox.ac.uk/" },
      { name: "University of Pennsylvania", url: "https://www.upenn.edu/" },
      { name: "Yale University", url: "https://www.yale.edu/" }
    ],
    "Groups and Projects": [
      { name: "NCOR (National Center for Ontological Research)", url: "https://ncorwiki.buffalo.edu/" },
      { name: "National Center for Biomedical Ontology (NCBO)", url: "https://www.bioontology.org/" },
      { name: "OBO Foundry", url: "http://www.obofoundry.org/" },
      { name: "OGC (Open Geospatial Consortium)", url: "https://www.ogc.org/" },
      { name: "OOR (Open Ontology Repository)", url: "http://oor.net/" },
      { name: "OntoCommons", url: "https://ontocommons.eu/" },
      { name: "OntoHub", url: "https://ontohub.org/" },
      { name: "OntoUML", url: "http://www.ontouml.org/" },
      { name: "Open Biomedical Ontologies", url: "http://www.obofoundry.org/" },
      { name: "SPARQL-OWL community", url: "https://github.com/AKSW/sparql-owl" },
      { name: "SWAN (Semantic Web Applications in Neuromedicine)", url: "https://www.openphacts.org/swan/" },
      { name: "Semantic Web for Health Care and Life Sciences Interest Group (HCLS IG)", url: "https://www.w3.org/blog/hcls/" }
    ],
    "Good Ontology Design (GoodOD)": [
      { name: "BFO2 Reference Ontology (bfo2-ref)", url: "https://github.com/BFO-ontology/BFO2-Reference" },
      { name: "NeOn Toolkit", url: "http://neon-toolkit.org/" },
      { name: "OOPS! (OntOlogy Pitfall Scanner!)", url: "http://oops.linkeddata.es/" },
      { name: "OntoClean", url: "https://philpapers.org/archive/GUACOP.pdf" },
      { name: "OntoUML", url: "http://www.ontouml.org/" },
      { name: "Protege", url: "https://protege.stanford.edu/" },
      { name: "WebProtege", url: "https://webprotege.stanford.edu/" }
    ]
  };

  return (
    <Layout title="Users" description="Ontologies, institutions, and projects using BFO">
      <div className="container margin-vert--lg">
        <h1>Users of BFO</h1>
        <p>
          Below you will find an alphabetical list of <strong>ontologies</strong>, <strong>institutions</strong>,{' '}
          <strong>groups and projects</strong>, and <strong>Good Ontology Design (GoodOD)</strong> initiatives that use or support the Basic Formal Ontology.
        </p>
        <p>
          <strong>Jump to:</strong>{' '}
          <a href="#ontologies">Ontologies</a> |{' '}
          <a href="#institutions">Institutions</a> |{' '}
          <a href="#groups-and-projects">Groups and Projects</a> |{' '}
          <a href="#good-ontology-design-goodod">GoodOD</a>
        </p>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '100%',
            maxWidth: 400,
            margin: '1rem 0',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        {Object.entries(userData).map(([category, items]) => {
          const anchorId = category.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
          const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );

          if (filtered.length === 0) return null;

          return (
            <div key={category}>
              <div id={anchorId} />
              <details open className="margin-bottom--md">
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {category}
                </summary>
                <ul>
                  {filtered.sort((a, b) => a.name.localeCompare(b.name)).map((item, idx) => (
                    <li key={idx}>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
