import { Path, GET, PathParam } from 'typescript-rest';

import sampleChildren from './sampleChildren.json';
import sampleLineage from './sampleLineage.json';

interface Taxon {
    id: string;
    name: string;
    rank: string;
}

interface GetTaxonFound {
    found: true;
    taxon: Taxon;
}

interface GetTaxonNotFound {
    found: false;
}

const sampleTaxonomy: Array<Taxon> = sampleChildren.concat(sampleLineage);

const sampleTaxonomyDB: Map<string, Taxon> = sampleTaxonomy.reduce((db, taxon: Taxon) => {
    db.set(taxon.id, taxon);
    return db;
}, new Map<string, Taxon>());

@Path('/services/taxonomy-api')
export default class TaxonomyApiService {
    // @Path(':name')
    // @GET
    // sayHello(@PathParam('name') name: string): string {
    //     return 'Hi ' + name;
    // }

    @Path('get_ancestors/:id')
    @GET
    getLineage(@PathParam('id') taxonID: string): Array<Taxon> {
        return sampleLineage;
    }

    @Path('get_descendents/:id')
    @GET
    getChildren(@PathParam('id') taxonID: string): Array<Taxon> {
        return sampleChildren;
    }

    @Path('get_taxon/:id')
    @GET
    getTaxon(@PathParam('id') taxonID: string): GetTaxonFound | GetTaxonNotFound {
        const taxon = sampleTaxonomyDB.get(taxonID);
        if (taxon) {
            return {
                found: true,
                taxon
            };
        }
        return {
            found: false
        };
    }
}
