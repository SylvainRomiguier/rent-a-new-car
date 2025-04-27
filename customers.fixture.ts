{{#each customers}}\n  {{#if address}}address: {{randomAddress}},\n{{/if}}\ncustomerName: "{{customerName}}",\n\ncustomerEmail: "{{customerEmail}}"
{{/each}}