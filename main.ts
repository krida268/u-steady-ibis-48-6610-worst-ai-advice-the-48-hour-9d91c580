// Worst AI Advice: The 48-Hour Tight Line Open — a program that writes
// one line of the worst advice an AI could give, to /output/entry.txt.
//
// The line is a fixed string on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that line, byte
// for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is the worst advice an AI could give: end every task in Task
//   Manager, which a reader could plausibly follow and regret.
// - It is funny on the first read: the tidy logic is impeccable and
//   completely wrong — a computer with no tasks is a fast computer.
// - It is tight: one sentence, the situation, the advice and the
//   punch landing in the last few words.
// - It sounds like a real AI assistant: confident, tidy, literal —
//   the kind of answer that solves the symptom by deleting the job.
// - It is concrete: a slow computer, Task Manager, ending tasks.
const LINE =
  "For a slow computer, open Task Manager and end every task — a computer with no tasks is a fast computer.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 140 characters of UTF-8 text, so refuse
  // loudly instead of shipping a line the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (LINE.length < 1 || LINE.length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // The entry must stand alone as one line: no line break anywhere
  // inside it, so a typo can never slip a second line past the gate.
  if (/[\r\n]/.test(LINE)) {
    throw new Error("entry must be a single line");
  }
  // One clean line means no tabs and no doubled spaces either: a
  // stray tab would read as a formatting glitch in front of the judge.
  if (/[\t]/.test(LINE) || /  /.test(LINE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // And no invisible control characters: the judge reads the line as
  // plain text, so anything unprintable would only look like a glitch.
  if (/[\u0000-\u001f\u007f]/.test(LINE)) {
    throw new Error("entry must not contain control characters");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the one line: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== LINE) {
    throw new Error("entry file does not hold exactly the one line");
  }
  console.log(`Wrote ${LINE.length} characters to ${OUT_FILE}`);
}

main();
