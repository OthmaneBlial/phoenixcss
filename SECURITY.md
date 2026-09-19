# Security policy

## Supported versions

PhoenixCSS does not yet have a verified public release. The `0.1.0` value in `package.json` identifies a locally tested source tarball, not a published support commitment. Report issues against the current `main` branch and include the commit hash you tested. This section will be updated when a release exists.

## Report a vulnerability privately

Use [GitHub's private vulnerability reporting for this repository](https://github.com/OthmaneBlial/phoenixcss/security/advisories). On the Advisories page, choose **Report a vulnerability**. Private reporting was enabled for this repository on 19 September 2026 and checked through the GitHub API. Please avoid posting exploit details in a public issue.

Include the affected commit or version, a minimal reproduction, browser or build environment, impact, and any suggested fix. Do not include live credentials, personal data, or unrelated files. There is no promised response time while the project is maintained by one person.

## Scope and threat model

PhoenixCSS ships CSS, not a JavaScript runtime. Its main security surfaces are dependency and build-chain integrity, unexpected remote assets, unsafe HTML/JavaScript in the documentation examples, and cascade rules that interfere with host interfaces. The build dependencies do not become runtime dependencies of a copied CSS file. Example scripts use local DOM APIs for documentation controls and form validation; the form example sends no data when its script runs.

Before a release, maintainers run the full dependency audit, lint and tests, review the generated CSS and package contents, and verify published artifacts separately. A clean dependency audit is not proof that every browser or consuming site is secure.
