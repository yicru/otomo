import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiResourceConstruct } from "../construct/api-resource.construct";

export class OtomoStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const productionApiResource = new ApiResourceConstruct(
			this,
			"ProductionApiResource",
			{
				appEnv: "production",
			},
		);

		Tags.of(productionApiResource).add("Env", "production");
	}
}
