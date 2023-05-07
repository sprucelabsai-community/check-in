import RootSkillViewController from '../../skillViewControllers/Root.svc'

const vcs = {
    RootSkillViewController,
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'checkin.root': RootSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'checkin.root': LoadOptions<Parameters<RootSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'checkin.root': RootSkillViewController
	}

    interface ViewControllerOptionsMap {
	}
}


//@ts-ignore
if(typeof heartwood === 'function') { heartwood(vcs) }

export default vcs