# Adding a build

1. Fill `src/intake.md`.
2. Read `src/system/OS.md` → follow stages 1–6.
3. **Before writing a panel, check `src/templates/panels.lib.js`.** Reuse beats
   reinvent — a reused panel is already validated.
4. New panel? Write it to the contract (`mount / render / export`), add it to the
   library, and log it in `src/system/panel-ledger.md`. That is how the library
   compounds instead of forking.
5. Run the validation gate (`src/system/06-VALIDATE.md`). Nothing ships with a
   failure in the **must** set — especially #3: *every panel must read a bus key.*
   A panel that renders the same thing regardless of input is a picture.
6. Validate your `mockRun` in node across edge cases. Check monotonicity.
