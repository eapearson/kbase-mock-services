import sampleChildrenData from './data/sampleChildren.json';
import sampleParentsData from './data/sampleParents.json';
import sampleHierarchicalAncestorsData from './data/sampleHierarchicalAncestors.json'

interface OntologyTerm {
    id: string;
    name: string;
}

interface TermRef {
    ns: string;
    id: string;
    ts: number;
}

interface TermsRef {
    ns: string;
    ids: Array<string>;
    ts: number;
}

interface GetTermsParams extends TermsRef { };

interface GetTermsResult {
    results: Array<OntologyTerm | null>;
    ns: string;
    ts: number;
    stats: any; // TODO: define this
}

interface GetParentsParams extends TermRef {
}

interface GetParentsResult {
    results: Array<OntologyTerm | null>;
    ns: string;
    ts: number;
    stats: any; // TODO: define this
}

interface GetChildrenParams extends TermRef { };

interface GetChildrenResult {
    results: Array<OntologyTerm | null>;
    ns: string;
    ts: number;
    stats: any; // TODO: define this
}

interface GetHierarchicalAncestorsParams extends TermRef { };

export interface XRef {
    val: string;
}

export interface Synonym {
    pred: string;
    val: string;
    xrefs: Array<XRef>
}

export interface TermNode {
    namespace: string;
    id: string;
    alt_ids: Array<string>;
    name: string;
    comments: Array<string>;
    def: {
        val: string;
        xrefs: Array<XRef>;
    };
    created: number;
    expired: number;
    subsets: Array<string>;
    synonyms: Array<Synonym>;
    type: string;
    xrefs: Array<XRef>;
}

export type EdgeType = 'is_a' | 'part_of' | 'has_part' | 'regulates' | 'positively_regulates' |
    'negatively_regulates' | 'occurs_in' | 'ends_during' | 'happens_during';

export interface TermEdge {
    id: string;
    type: string; // TODO: should be EdgeType but TS isn't smart enough to deal the json string value 
    created: number;
    expired: number;
    from: string;
    to: string;
}

export interface RelatedTerm {
    term: TermNode;
    edge: TermEdge;
}

interface GetHierarchicalAncestorsResult {
    results: Array<RelatedTerm | null>;
    ns: string;
    ts: number;
    stats: any; // TODO: define this
}

const sampleParents: Array<OntologyTerm> = sampleParentsData;

const sampleChildren: Array<OntologyTerm> = sampleChildrenData;

const sampleTerms = sampleParents.concat(sampleChildren);

const sampleHierarchicalAncestors: Array<RelatedTerm> = sampleHierarchicalAncestorsData;

const sampleOntologyDB: Map<string, OntologyTerm> = sampleTerms.reduce((db, term: OntologyTerm) => {
    db.set(term.id, term);
    return db;
}, new Map<string, OntologyTerm>());

export default class OntologyAPI {
    handle(method: string, params: any) {
        switch (method) {
            case 'get_parents':
                return this.getParents(params);
            case 'get_children':
                return this.getChildren(params);
            case 'get_terms':
                return this.getTerms(params);
            case 'get_hierarchical_ancestors':
                return this.getHierarchicalAncestors(params);
        }
    }
    async getParents([{ ns, id, ts }]: [GetParentsParams]): Promise<[GetParentsResult]> {
        return Promise.resolve([{
            results: sampleParents,
            ns, ts,
            stats: {} // TODO: populate
        }]);
    }
    async getChildren([{ ns, id, ts }]: [GetChildrenParams]): Promise<[GetChildrenResult]> {
        return Promise.resolve([{
            results: sampleChildren,
            ns, ts,
            stats: {} // TODO: populate
        }]);
    }
    async getHierarchicalAncestors([{ ns, id, ts }]: [GetHierarchicalAncestorsParams]): Promise<[GetHierarchicalAncestorsResult]> {
        return Promise.resolve([{
            results: sampleHierarchicalAncestors,
            ns, ts,
            stats: {} // TODO: populate
        }]);
    }
    async getTerms([{ ns, ids, ts }]: [GetTermsParams]): Promise<[GetTermsResult]> {
        const terms = ids.map((id) => {
            return sampleOntologyDB.get(id) || null;
        });

        return Promise.resolve([{
            results: terms,
            ns, ts,
            stats: {} // TODO: populate
        }]);
    }
}
