<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { WithElementRef } from '$lib/utils.js';
	import { Search } from "lucide-svelte";
 	import type { HTMLFormAttributes } from 'svelte/elements';
	let { ref = $bindable(null), ...restProps }: WithElementRef<HTMLFormAttributes> = $props();
</script>

<form bind:this={ref} {...restProps}>
	<Sidebar.Group class="py-0">
		<Sidebar.GroupContent class="relative">
			<Label for="search" class="sr-only">Search</Label>
			<Sidebar.Input id="search" placeholder="Search chats..." class="pl-8" />
			<Search
				class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
			/>
		</Sidebar.GroupContent>
	</Sidebar.Group>
</form>
