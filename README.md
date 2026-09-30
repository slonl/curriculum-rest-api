# curriculum-rest-api
REST api for curriculum data, uses the GraphQL server in https://github.com/slonl/curriculum-graphql-server. It is written in javascript, using nodejs, with the express framework.

The REST api uses the GraphQL server as a backend, the reverse of the traditional role. The advantage is that the code base is very small and simple. You can easily extend / alter the REST api. Each route is generally a thin wrapper around a specific GraphQL query.

The exception is the `legacy/` route. The source data was less strict in how the UUID's were used. This meant that you needed all the parent ID's to uniquely identify the data linked to a specific UUID. This dataset was split so that each UUID is now uniquely tied to a single set of data. When querying such replaced entities by their original UUID, you get a `replacedBy` array that lists all new ID's linked to the original entity. To find the correct ID that matches the data in the legacy dataset, you must specify its original parent ID's as well. e.g.:

`/legacy/vak/bk:2b363227-8633-4652-ad57-c61f1efc02c8/vakkern/bk:25661339-1281-434c-be08-b7f5ac8cd432/vaksubkern/bk:f719f7e0-ba85-493d-8d78-b0910a38c7d8`

The legacy route will find the new entities for each of the parent ID's and filter the result entities to only those that have the same (updated) parent relations.

You can read more about the data architecture and the `replacedBy`/`replaces` mechanic in the dataset repositories:
- https://github.com/slonl/curriculum-doelen
- https://github.com/slonl/curriculum-inhouden

## Editor orphan view

After logging in as an editor, open **Wezen** in the side menu (`/orphans/`).
The API also requires editor access. The view lists non-root curriculum entities
with missing or empty root lists, excluding `KerndoelUitstroomprofiel`,
`Deprecated`, and entities already marked `deleted`.

Select entities and choose **Selectie als verwijderd markeren**. This stages
ordinary deletion changes for the existing review and commit flow. Committing
sets `deleted: true`; the release procedure performs deprecation later.
The list refreshes after a successful commit.

Deploy this alongside curriculum-store's `orphanOnly` deletion guard. It checks
the selected entities again when executing the command and rejects the selection
if an entity has since gained a root or is otherwise ineligible.

Scanning uses one `/slowquery/` request. The view shows the loading circle
while it waits, then displays the results or an error. Adjust curriculum-store's
`QUERY_MEMORY_LIMIT` (MiB) for the dataset size; its default is 64. The local
69,000-entity dataset completes the scan with a 256 MiB limit.

Focused checks: `npx tap --disable-coverage test/orphans.mjs`.
