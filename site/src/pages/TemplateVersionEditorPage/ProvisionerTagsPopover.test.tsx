import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockTemplateVersion } from "testHelpers/entities";
import { renderComponent } from "testHelpers/renderHelpers";
import { ProvisionerTagsPopover } from "./ProvisionerTagsPopover";

let tags = MockTemplateVersion.job.tags;

describe("ProvisionerTagsPopover", () => {
	describe("click the button", () => {
		it("can add a tag", async () => {
			const onSubmit = jest.fn().mockImplementation(({ key, value }) => {
				tags = { ...tags, [key]: value };
			});
			const onDelete = jest.fn().mockImplementation((key) => {
				const newTags = { ...tags };
				delete newTags[key];
				tags = newTags;
			});
			const { rerender } = renderComponent(
				<ProvisionerTagsPopover
					tags={tags}
					onSubmit={onSubmit}
					onDelete={onDelete}
				/>,
			);

			// Open Popover
			const btn = await screen.findByRole("button");
			expect(btn).toBeEnabled();
			await userEvent.click(btn);

			// Check for existing tags
			const el = await screen.findByText(/scope/i);
			expect(el).toBeInTheDocument();

			// Add key and value
			const el2 = await screen.findByLabelText("Key");
			expect(el2).toBeEnabled();
			fireEvent.change(el2, { target: { value: "foo" } });
			expect(el2).toHaveValue("foo");
			const el3 = await screen.findByLabelText("Value");
			expect(el3).toBeEnabled();
			fireEvent.change(el3, { target: { value: "bar" } });
			expect(el3).toHaveValue("bar");

			// Submit
			const btn2 = await screen.findByRole("button", {
				name: /add/i,
				hidden: true,
			});
			expect(btn2).toBeEnabled();
			await userEvent.click(btn2);
			expect(onSubmit).toHaveBeenCalledTimes(1);

			rerender(
				<ProvisionerTagsPopover
					tags={tags}
					onSubmit={onSubmit}
					onDelete={onDelete}
				/>,
			);

			// Check for new tag
			const fooTag = await screen.findByText(/foo/i);
			expect(fooTag).toBeInTheDocument();
			const barValue = await screen.findByText(/bar/i);
			expect(barValue).toBeInTheDocument();
		});
		it("can remove a tag", async () => {
			const onSubmit = jest.fn().mockImplementation(({ key, value }) => {
				tags = { ...tags, [key]: value };
			});
			const onDelete = jest.fn().mockImplementation((key) => {
				delete tags[key];
				tags = { ...tags };
			});
			const { rerender } = renderComponent(
				<ProvisionerTagsPopover
					tags={tags}
					onSubmit={onSubmit}
					onDelete={onDelete}
				/>,
			);

			// Open Popover
			const btn = await screen.findByRole("button");
			expect(btn).toBeEnabled();
			await userEvent.click(btn);

			// Check for existing tags
			const el = await screen.findByText(/wowzers/i);
			expect(el).toBeInTheDocument();

			// Find Delete button
			const btn2 = await screen.findByRole("button", {
				name: /delete-wowzers/i,
				hidden: true,
			});
			expect(btn2).toBeEnabled();

			// Delete tag
			await userEvent.click(btn2);
			expect(onDelete).toHaveBeenCalledTimes(1);

			rerender(
				<ProvisionerTagsPopover
					tags={tags}
					onSubmit={onSubmit}
					onDelete={onDelete}
				/>,
			);

			// Expect deleted tag to be gone
			const el2 = screen.queryByText(/wowzers/i);
			expect(el2).not.toBeInTheDocument();
		});
	});
});
