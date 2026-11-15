---
title: DNS Propagation
seo_title: "Check DNS Propagation on iPhone, iPad and Mac, with Your Own Resolver Lists - WebSSH"
description: "Send one DNS query to resolvers around the world from WebSSH and see whether they agree. Build your own resolver lists (ISP caches, internal DNS servers) and query them alone or together with the worldwide list."
---

# DNS Propagation
After a DNS change, every resolver keeps its cached answer until the TTL runs out, so the world does not switch at once. The **Propagation** mode of the DNS Lookup tool sends the same query to many resolvers at the same time and tells you whether they agree.

## Run a propagation check
1. Open **Tools** > **DNS Lookup** (on the Mac: **Tools** menu, or `⌃⌥⌘D`)
2. Type the name to check and switch from **Lookup** to **Propagation**
3. Pick the record type: **A**, **AAAA**, **MX**, **NS** or **TXT**
4. Press the play button, or Return

Changing the record type, or the resolver lists, runs the check again.

## Read the result
The first card is the verdict: **Consistent** when every resolver that answered returned the same records, **Inconsistent** with the number of different answers otherwise, and how many resolvers answered.

The resolvers are then grouped by outcome, the anomalies first:

| Group | Meaning |
| --- | --- |
| **No response** | The resolver did not answer: **Timeout** after 5 seconds, or **Failed** when the connection could not be made |
| **Divergent answer** | Resolvers that returned something else than the majority, one card per answer |
| **In progress** | Still waiting |
| **Majority answer** | The answer most resolvers gave. An empty answer (**No record**) is an answer too |

Each resolver line shows its flag, its name, its address, then the response time and the TTL of its answer. Long press a card to copy its answer.

**Anycast** marks a resolver that answers from the point of presence nearest to you: its flag is the country of its operator, not the place your query landed.

| | FREE | PRO |
| --- | --- | --- |
| Worldwide resolvers | 4 (Cloudflare, Google, Quad9, KT) | 29 |
| Your own resolver lists | :cross_mark: | :white_check_mark: |

## Resolver lists[^1]
The worldwide list only holds public resolvers that answer anyone. The resolvers you care about may not be in it: the caches of the ISPs of a country, the internal DNS servers of your company, the resolvers of a datacenter. Group them in **resolver lists** and query them alone or together with the worldwide list.

!!! info "WebSSH PRO"
    Resolver lists are part of [WebSSH PRO](/documentation/pricing/).

### Create a list
1. In **Propagation**, open the **Resolvers** menu under the mode selector and choose **Manage lists…**
2. Press the add button at the top right
3. Name the list, for example "Poland" or "Office"
4. Type the **IP address** of a resolver (IPv4 or IPv6) and, optionally, a label such as the name of the operator
5. Press **Add a resolver** for each other address
6. Press **Save**

A list holds up to 50 resolvers. To remove a resolver, press the trash button of its row. To change a list later, tap it in **Resolver lists**; to delete it, use its context menu.

### Choose the lists of a check
The **Resolvers** menu shows **Worldwide** and your lists, each with its number of resolvers. Check one or several: the check queries all of them at once, one line per address.

- **Worldwide** alone is the default. Uncheck it to query only your own lists.
- A list is checked as soon as you create it.
- The resolvers of your lists show a server symbol instead of a flag, and the name of their list.

## Good to know
- Resolvers are queried over **TCP on port 53**. A resolver that only answers over UDP shows as **Failed**.
- Most ISP caches only answer their own subscribers. From another network they show as **No response**; this is expected, and it is why they are not part of the worldwide list. Run the check from that network, or through a VPN that ends in it.
- An address present in several checked lists is queried once. If it also belongs to the worldwide list, it keeps its flag.
- A check queries at most 150 resolvers.
- A record served as a rotating pool (round robin, a CDN that balances between hosts) returns a different subset to each resolver. **Inconsistent** is the normal result for such a record.
- A list accepts IP addresses only. To ask a single server by name, use the **Lookup** mode and append it to the name: `example.com@ns1.example.net`.
- The worldwide list leaves out a service in the regions where it no longer operates (OpenDNS in France and Portugal), based on the region of your device.
- Your lists are synced with [iCloud](/documentation/help/iCloud/). The lists that are checked are remembered on each device.
- The resolvers you query see the name you check and your IP address. See [Who sees what](/documentation/tools/#who-sees-what).

[^1]: Resolver lists require WebSSH 33.4 or later ([#1792](https://github.com/isontheline/pro.webssh.net/issues/1792)). The Propagation mode is available since WebSSH 32.4.
