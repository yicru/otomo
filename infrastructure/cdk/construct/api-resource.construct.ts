import { RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

type ApiResourceConstructProps = {
	readonly appEnv: "production";
};

export class ApiResourceConstruct extends Construct {
	constructor(scope: Construct, id: string, props: ApiResourceConstructProps) {
		super(scope, id);

		const bucket = new s3.Bucket(this, "Bucket", {
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
			bucketName: `otomo-${props.appEnv}`,
			publicReadAccess: true,
			removalPolicy: RemovalPolicy.DESTROY,
		});

		const user = new iam.User(this, "User", {
			managedPolicies: [
				iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonPollyFullAccess"),
			],
			userName: `otomo-${props.appEnv}`,
		});

		bucket.grantWrite(user);
	}
}
