Findings

- [High] `orders.service.ts:42` - The query fetches an order by ID but does not verify ownership before returning it. Any authenticated user who knows an order ID could read another user's order. Add an owner or permission check before returning the response.
- [Medium] `email.controller.ts:18` - The endpoint sends external email immediately after receiving a request. This is an action-allowed workflow and should require either a draft-only step or explicit approval with a Vibe Diff.

Required Controls

- Add resource-level authorization for order reads.
- Add approval or draft mode before external email sending.

Approval Required

- Yes, for external email sending.

Vibe Diff Needed

- Yes. The user should see recipient, subject, sender, data source, and whether the email is a draft or final send.

Residual Risk

- Email content may still include sensitive data if templates are populated from unmasked user input.

Summary

- Not ready until resource authorization and external-send approval are added.
