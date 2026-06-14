import { createRouter, createWebHistory } from "vue-router";
import InboxSelectView from "../views/InboxSelectView.vue";
import MailboxView from "../views/MailboxView.vue";
import MessageView from "../views/MessageView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SearchView from "../views/SearchView.vue";
import { mailbox } from "../stores/mailbox";

const d = document.getElementById("app");
let webroot = "/";
if (d) {
	webroot = d.dataset.webroot;
}

// paths are relative to webroot
const router = createRouter({
	history: createWebHistory(webroot),
	routes: [
		{
			path: "/inbox",
			component: InboxSelectView,
		},
		{
			path: "/",
			component: MailboxView,
		},
		{
			path: "/search",
			component: SearchView,
		},
		{
			path: "/view/:id",
			component: MessageView,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			component: NotFoundView,
		},
	],
});

// Require inbox selection before accessing any page
router.beforeEach((to) => {
	if (to.path !== "/inbox" && !mailbox.inboxEmail) {
		return "/inbox";
	}
});

export default router;
