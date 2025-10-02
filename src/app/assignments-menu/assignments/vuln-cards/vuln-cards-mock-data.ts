export const SeverityParams: any = {
  low: { abbr: "L", title: "Low", color: "#0f93bb" },
  medium: { abbr: "M", title: "Medium", color: "#F3BB2D" },
  high: { abbr: "H", title: "High", color: "#E28722" },
  critical: { abbr: "C", title: "Critical", color: "#D9534F" },
  malicious: { abbr: "MAL", title: "Malicious", color: "black" },
};

export const vulnList = [
  {
    id: "CVE-2023-35116",
    summary:
      "jackson-databind through 2.15.2 allows attackers to cause a denial of service or other unspecified impact via a crafted object that uses cyclic dependencies. NOTE: the vendor's perspective is that this is not a valid vulnerability report, because the steps of constructing a cyclic data structure and trying to serialize it cannot be achieved by an external attacker.",
    cvss: 4.7,
    cvssVersion: "3.1",
    severity: "medium",
    vectorString: "CVSS:3.1/AV:L/AC:H/PR:L/UI:N/S:U/C:N/I:N/A:H",
    epss: 0.31,
    disputed: true,
    cwes: [
      {
        id: "CWE-770",
        name: "Allocation of Resources Without Limits or Throttling",
        description:
          "The product allocates a reusable resource or group of resources on behalf of an actor without imposing any restrictions on the size or number of resources that can be allocated, in violation of the intended security policy for that actor.",
      },
    ],
    publishedAt: 1686752100,
    modifiedAt: 1732176420,
    components: [
      {
        id: "0000000000000000000000000000000000000000000000000000000000000000",
        type: "package",
        name: "AaZoran-Test",
        versions: "2.0.4",
      },
    ],
    mappingSources: ["nvd"],
    scoringSources: ["nvd"],
    exploitable: false,
    exploitableSources: [],
    cveTags: [
      {
        sourceIdentifier: "cve@mitre.org",
        tags: ["disputed"],
      },
    ],
  },
  {
    id: "MAL-2023-8556",
    summary:
      "## Source: ossf-package-analysis (f127bd23e5c409b4d729767fb6df0fade7da73e67b9bf12303c53330c7970280)\nThe OpenSSF Package Analysis project identified 'primarycare' @ 1.0.0 (npm) as malicious.\n\nIt is considered malicious because:\n\n- The package communicates with a domain associated with malicious activity.\n",
    severity: "malicious",
    publishedAt: 1700600104,
    modifiedAt: 1700600104,
    components: [
      {
        id: "6a6dc77bf6ba0ce8d7177072ba0f5243ce733bb54f3943ec873ed48872ee71d0",
        type: "package",
        pkgType: "npm",
        name: "primarycare",
        version: "1.0.0",
      },
    ],
    mappingSources: ["osv"],
    mappingSourcesModifiedAt: 1700600104,
  },
];
