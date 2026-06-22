import { DATASETS, findDataset } from '$lib/dashboard';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => DATASETS.map((dataset) => ({ slug: dataset.name }));

export const load: PageLoad = ({ params }) => {
	const dataset = findDataset(params.slug);

	if (!dataset) {
		error(404, 'Dataset not found');
	}

	return { dataset };
};
