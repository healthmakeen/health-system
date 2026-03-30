# Supabase Email Templates

Ready-to-paste templates for Supabase Auth emails.

## Confirm Signup

Use:

- [confirm-signup.html](/Users/aminmasri/Documents/Documents%20-%20Muna%E2%80%99s%20MacBook%20Air/makeenHealth/supabase/templates/confirm-signup.html)

Paste it in:

1. Supabase Dashboard
2. `Authentication`
3. `Email Templates`
4. `Confirm signup`
5. Replace the existing HTML
6. Save

## Reset Password

Use:

- [reset-password.html](/Users/aminmasri/Documents/Documents%20-%20Muna%E2%80%99s%20MacBook%20Air/makeenHealth/supabase/templates/reset-password.html)

Paste it in:

1. Supabase Dashboard
2. `Authentication`
3. `Email Templates`
4. `Reset Password`
5. Replace the existing HTML
6. Save

Important placeholders used by Supabase:

- `{{ .ConfirmationURL }}`
- `{{ .Email }}`

Before testing, make sure Supabase `Site URL` and `Redirect URLs` are set to your live app URLs so the confirm button does not send users to localhost.
