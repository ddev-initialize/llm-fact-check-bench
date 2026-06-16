import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

function basePathFromEnv(value: string | undefined): '' | `/${string}` {
	if (!value) {
		return '';
	}

	return value.startsWith('/') ? `/${value.slice(1)}` : `/${value}`;
}

const basePath = process.argv.includes('dev') ? '' : basePathFromEnv(process.env.BASE_PATH);

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({
				fallback: '404.html'
			}),

			paths: {
				base: basePath
			},

			typescript: {
				config: (config) => ({
					...config,
					include: [...config.include, '../drizzle.config.ts']
				})
			}
		})
	]
});
