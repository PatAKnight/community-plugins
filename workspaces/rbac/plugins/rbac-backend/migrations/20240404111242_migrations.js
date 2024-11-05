/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

exports.up = async function up(knex) {
  const isRoleMetaDataExist = await knex.schema.hasTable('role-metadata');
  if (isRoleMetaDataExist) {
    await knex.schema.alterTable('role-metadata', table => {
      table.string('author');
      table.string('modifiedBy');
      table.dateTime('createdAt');
      table.dateTime('lastModified');
    });

    await knex('role-metadata')
      .update({
        description:
          'The default permission policy for the admin role allows for the creation, deletion, updating, and reading of roles and permission policies.',
        author: 'application configuration',
        modifiedBy: 'application configuration',
        lastModified: new Date().toUTCString(),
      })
      .where('roleEntityRef', 'role:default/rbac_admin');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  const isRoleMetaDataExist = await knex.schema.hasTable('role-metadata');
  if (isRoleMetaDataExist) {
    await knex.schema.alterTable('role-metadata', table => {
      table.dropColumn('author');
      table.dropColumn('modifiedBy');
      table.dropColumn('createdAt');
      table.dropColumn('lastModified');
    });
  }
};