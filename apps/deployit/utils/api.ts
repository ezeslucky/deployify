import {
	createWSClient,
	experimental_formDataLink,
	httpBatchLink,
	splitLink,
	wsLink,
} from "@trpc/client";

import { createTRPCNext } from "@trpc/next";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

