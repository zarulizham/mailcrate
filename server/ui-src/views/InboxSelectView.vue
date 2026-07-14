<script>
import CommonMixins from "../mixins/CommonMixins";
import { mailbox } from "../stores/mailbox";

const RECENT_INBOXES_KEY = "recentInboxes";
const MAX_RECENT = 5;

export default {
	mixins: [CommonMixins],

	data() {
		return {
			email: mailbox.inboxEmail || "",
			filterType: mailbox.inboxFilterType || "to",
			recentInboxes: [],
			error: "",
		};
	},

	mounted() {
		try {
			const stored = JSON.parse(localStorage.getItem(RECENT_INBOXES_KEY) || "[]");
			if (Array.isArray(stored)) {
				this.recentInboxes = stored.filter((e) => typeof e === "string");
			}
		} catch {
			this.recentInboxes = [];
		}
	},

	methods: {
		selectInbox(email) {
			const trimmed = email.trim().toLowerCase();
			if (!trimmed) {
				this.error = "Please enter an email address or *";
				return;
			}

			// * means show all messages with no filter
			if (trimmed !== "*") {
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
					this.error = "Please enter a valid email address or *";
					return;
				}

				// Persist to recent inboxes list (not saved for *)
				let recent = this.recentInboxes.filter((e) => e !== trimmed);
				recent.unshift(trimmed);
				if (recent.length > MAX_RECENT) {
					recent = recent.slice(0, MAX_RECENT);
				}
				localStorage.setItem(RECENT_INBOXES_KEY, JSON.stringify(recent));
			}

			mailbox.inboxEmail = trimmed;
			mailbox.inboxFilterType = this.filterType;
			this.$router.push("/");
		},

		submit() {
			this.error = "";
			this.selectInbox(this.email);
		},
	},
};
</script>

<template>
	<div
		class="d-flex flex-column align-items-center justify-content-center min-vh-100"
		data-bs-theme="dark"
		style="background-color: #2c3e50; margin-inline: calc(var(--bs-gutter-x, 1.5rem) * -0.5)"
	>
		<div class="mb-4 text-center">
			<img :src="resolve('/mailpit.svg')" alt="MailCrate" height="52" />
			<h1 class="mt-3 h3 fw-bold text-white">MailCrate</h1>
		</div>

		<div class="card w-100 border-secondary" style="max-width: 420px; background-color: #161b22">
			<div class="card-body p-4">
				<h5 class="card-title mb-1 text-white">Access your inbox</h5>
				<p class="text-secondary small mb-3">Enter an email address to view its messages</p>

				<form @submit.prevent="submit">
					<div class="mb-3">
						<label for="inboxEmail" class="form-label text-light">Email address</label>
						<input
							id="inboxEmail"
							v-model="email"
							type="text"
							class="form-control form-control-lg"
							:class="error ? 'is-invalid' : ''"
							placeholder="you@example.com"
							autocomplete="email"
							autofocus
						/>
						<div v-if="error" class="invalid-feedback">{{ error }}</div>
					</div>
					<div class="mb-3">
						<label class="form-label text-light">Match against</label>
						<div class="btn-group w-100" role="group">
							<input
								id="filterTo"
								v-model="filterType"
								type="radio"
								class="btn-check"
								value="to"
								autocomplete="off"
							/>
							<label class="btn btn-outline-light" for="filterTo">To (receiver)</label>

							<input
								id="filterFrom"
								v-model="filterType"
								type="radio"
								class="btn-check"
								value="from"
								autocomplete="off"
							/>
							<label class="btn btn-outline-light" for="filterFrom">From</label>
						</div>
					</div>
					<button type="submit" class="btn btn-primary w-100">
						View Inbox
						<i class="bi bi-arrow-right ms-1"></i>
					</button>
				</form>
			</div>
		</div>

		<div v-if="recentInboxes.length" class="mt-3 text-center w-100" style="max-width: 420px">
			<p class="text-secondary small mb-2">Recent inboxes:</p>
			<div class="d-flex flex-wrap gap-2 justify-content-center">
				<button
					v-for="recent in recentInboxes"
					:key="recent"
					class="btn btn-sm btn-outline-light"
					@click="selectInbox(recent)"
				>
					<i class="bi bi-envelope me-1"></i>{{ recent }}
				</button>
			</div>
		</div>
	</div>
</template>
