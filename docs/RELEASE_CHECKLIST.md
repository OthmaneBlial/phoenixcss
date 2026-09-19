# Release checklist

This checklist describes the first PhoenixCSS release without implying that it has been published. The current version is `0.1.0`; update the version, changelog, migration note, and release notes together before choosing another version.

## Preflight on the candidate commit

Run these commands from a clean checkout with Node 24.21.0:

```bash
npm ci
npm run lint
npm test
npm audit --audit-level=low
npm exec --yes --package=node@24.21.0 -- node scripts/make-release.mjs
(cd dist/release && sha256sum --check SHA256SUMS.txt)
```

Inspect `dist/release/` and confirm that it contains exactly the four CSS files, the versioned npm tarball, and `SHA256SUMS.txt`. Check that the tarball lists the CSS and Sass sources, that the README does not claim a publication that has not happened, and that every checksum is calculated from the downloaded candidate files.

The release workflow repeats source checks, all browser engines, and the artifact rehearsal. A manual `workflow_dispatch` is a rehearsal only: its `publish` and `site` jobs are intentionally skipped.

## Human and publication gates

Before creating a tag, attach the evidence that is still external to the repository:

- two independent onboarding reviews using [`ONBOARDING_REVIEW.md`](ONBOARDING_REVIEW.md) and dated issue or review records;
- a real screen-reader session and an exact 200% keyboard/zoom check;
- final screenshot review against the candidate build;
- an explicit decision about whether npm publication is in scope.

Do not create a tag, GitHub Release, npm publication, or Pages deployment while one of these gates is only assumed. The repository can be pushed and its rehearsal workflow can remain green without any public release.

## Tagged release sequence

1. Confirm the candidate commit, version, changelog, release notes, README links, and migration notes.
2. Create the tag that matches the manifest (`v0.1.0` for the current candidate) and push that tag only after the gates above are recorded.
3. Let the `Release` workflow complete `source`, `browsers`, and `publish`; inspect the exact run rather than treating tag push as success.
4. Download every asset from the GitHub Release. Recalculate SHA-256, inspect the tarball, and install the downloaded tarball into a clean consumer project.
5. Confirm that the GitHub Release commit, asset names, checksums, README version, and changelog all agree.
6. Inspect the deployed Pages URL at HTTP 200, then check CSS, JavaScript, examples, anchors, console, mobile layout, and the version shown on the site.
7. Update the README only with URLs and badges that were observed on the public release and site. Keep npm explicitly marked unpublished if it was not published.

Record the tag, workflow run, asset hashes, download date, Pages URL, and any failed or skipped job in [`VALIDATION.md`](VALIDATION.md). A release artifact is not a device, browser, payment, or adoption claim.
