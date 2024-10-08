-- name: GetGroupMembers :many
SELECT * FROM group_members_expanded;

-- name: GetGroupMembersByGroupID :many
SELECT * FROM group_members_expanded WHERE group_id = @group_id;

-- name: GetGroupMembersCountByGroupID :one
-- Returns the total count of members in a group. Shows the total
-- count even if the caller does not have read access to ResourceGroupMember.
-- They only need ResourceGroup read access.
SELECT COUNT(*) FROM group_members_expanded WHERE group_id = @group_id;

-- InsertUserGroupsByName adds a user to all provided groups, if they exist.
-- name: InsertUserGroupsByName :exec
WITH groups AS (
    SELECT
        id
    FROM
        groups
    WHERE
        groups.organization_id = @organization_id AND
        groups.name = ANY(@group_names :: text [])
)
INSERT INTO
    group_members (user_id, group_id)
SELECT
    @user_id,
    groups.id
FROM
    groups;

-- name: RemoveUserFromAllGroups :exec
DELETE FROM
	group_members
WHERE
	user_id = @user_id;

-- name: InsertGroupMember :exec
INSERT INTO
    group_members (user_id, group_id)
VALUES
    ($1, $2);

-- name: DeleteGroupMemberFromGroup :exec
DELETE FROM
	group_members
WHERE
	user_id = $1 AND
	group_id = $2;
