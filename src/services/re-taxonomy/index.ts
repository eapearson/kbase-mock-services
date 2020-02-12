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

export default class TaxonomyAPI {
    handle(method: string, params: any) {
        switch (method) {
            case 'get_ancestors':
                return this.getAncestors(params);
            case 'get_descendants':
                return this.getDescendants(params);
            case 'get_taxon':
                return this.getTaxon(params);
        }
    }
    getAncestors([{ id }]: [{ id: string }]) {
        return sampleLineage;
    }
    getDescendants([{ id }]: [{ id: string }]) {
        return sampleChildren;
    }
    getTaxon([{ id }]: [{ id: string }]) {
        const taxon = sampleTaxonomyDB.get(id);
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
