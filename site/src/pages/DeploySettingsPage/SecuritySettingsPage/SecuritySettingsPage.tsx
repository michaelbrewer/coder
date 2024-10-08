import { Loader } from "components/Loader/Loader";
import { useDashboard } from "modules/dashboard/useDashboard";
import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import { pageTitle } from "utils/page";
import { useDeploySettings } from "../DeploySettingsLayout";
import { SecuritySettingsPageView } from "./SecuritySettingsPageView";

const SecuritySettingsPage: FC = () => {
	const { deploymentValues } = useDeploySettings();
	const { entitlements } = useDashboard();

	return (
		<>
			<Helmet>
				<title>{pageTitle("Security Settings")}</title>
			</Helmet>

			{deploymentValues ? (
				<SecuritySettingsPageView
					options={deploymentValues.options}
					featureBrowserOnlyEnabled={entitlements.features.browser_only.enabled}
				/>
			) : (
				<Loader />
			)}
		</>
	);
};

export default SecuritySettingsPage;
