<script lang="ts">
	import { page } from '$app/state';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import { Split } from "lucide-svelte";

	let { user } = $props();

	let count = $state(25)

	const query = $derived(useQuery(api.threads.getUserPaginatedThreadsWithOldestMessage, {
		offset: 0,
		count: count,
		user: user ? user.id : ''
	}));

	// Function to truncate message content
	function truncateChars(str, maxChars) {
		return str.length > maxChars ? str.slice(0, maxChars).trimEnd() + '...' : str;
	}

	// Function to group threads by date
	function groupThreadsByDate(threads) {
		const now = new Date();

		const groups = {
			"Today": [],
			"Yesterday": [],
			"Last 7 Days": [],
			"Last 30 Days": [],
			"Older": []
		};

		threads.forEach((result) => {
			const { oldestMessage } = result;
			const messageDate = new Date(oldestMessage.createdAt); // assuming createdAt is a field in oldestMessage

			const diffTime = now.getTime() - messageDate.getTime();
			const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays === 0) {
				groups['Today'].push(result);
			} else if (diffDays === 1) {
				groups['Yesterday'].push(result);
			} else if (messageDate.getTime() >= now.setDate(now.getDate() - now.getDay())) {
				groups['Last 7 Days'].push(result);
			} else if (
				messageDate.getTime() >= new Date(now.getFullYear(), now.getMonth(), 1).getTime()
			) {
				groups['Last 30 Days'].push(result);
			} else {
				groups['Older'].push(result);
			}
		});

		return groups;
	}
</script>

{#if query.isLoading}
	Loading...
{:else if query.error}
	failed to load: {query.error.toString()}
{:else}
	<Sidebar.Group>
		{@const groupedThreads = groupThreadsByDate(query.data.results)}
		{#each Object.entries(groupedThreads) as [dateLabel, threads]}
			{#if threads.length > 0}
				<Sidebar.GroupLabel
					>{dateLabel}</Sidebar.GroupLabel
				>
				<!-- Capitalize the label -->
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each threads as result}
							{@const thread = result.thread}
							{@const oldestMessage = result.oldestMessage}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={thread._id === page.params.thread}>
									<a href="/chat/{thread._id}" class="flex items-center">{#if thread.parentThread}<Split class="w-4 h-4 mr-2" />{/if}{truncateChars(oldestMessage.content, 25)}</a>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			{/if}
		{/each}
		{#if query.data.count >= count} <!-- Only show the button if there might be more data -->
			<Sidebar.MenuButton onclick={() => count += 10} class="flex justify-center">Load More...</Sidebar.MenuButton>
		{/if}
	</Sidebar.Group>
{/if}
