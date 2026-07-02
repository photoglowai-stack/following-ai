# Install Tools

This lab works immediately in mock mode. Install external tools only when you have authorization to test the target data.

## Recommended First

1. Sherlock

```bash
pipx install sherlock-project
```

2. Maigret

```bash
pipx install maigret
```

3. socialscan

```bash
pipx install socialscan
```

4. PhoneInfoga

Use the official PhoneInfoga installation instructions for your platform.

## Sensitive Tools To Keep Off

1. Holehe

```bash
pipx install holehe
```

Use only for `self_check` or `consent`.

2. Ignorant

```bash
pipx install ignorant
```

Use only for `self_check` or `consent`.

3. h8mail

```bash
pipx install h8mail
```

Return only safe breach metadata. Do not display passwords, hashes, or secrets.

4. GHunt

Use the official GHunt installation instructions. Do not use private third-party sessions, cookies, or tokens.

## Heavy Frameworks

1. SpiderFoot

Install and run separately using the official documentation. The MVP exposes it as a health-check-only integration.

2. Recon-ng

Install and run separately using the official documentation. The MVP keeps it out of the fast lookup flow because module selection can become invasive.

## WhatsMyName Dataset

Download the official WhatsMyName dataset manually and place it at:

```text
data/whatsmyname.json
```

The MVP uses it as a dataset-first provider and does not spam public sites.
