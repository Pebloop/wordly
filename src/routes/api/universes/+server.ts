import { json, error } from '@sveltejs/kit';
import {database} from "../../../lib/database/db";
import { PROFILE_ID, FORCE_LOGIN } from "$env/static/private"

export async function POST({ request }: { request: Request }) {
    const {name, session} = await request.json();

    /*if (FORCE_LOGIN == 'true') {
        const createdUniverse = await database.universes.create({name, owners: +PROFILE_ID});
        return json({universe: createdUniverse[0]});
    }*/

    if (!session || !session.user || !session.user.id) {
        console.log('no session');
        throw error(401, 'Unauthorized');
    }

    const account = await database.auth.getAccountByUserId(session.user.id);
    if (account.length === 0) {
        console.log('no account');
        throw error(401, 'Unauthorized');
    }

    const profile = await database.profiles.getByGoogleId(account[0].providerAccountId);
    if (profile.length === 0) {
        console.log('no profile');
        throw error(401, 'Unauthorized');
    }

    const createdUniverse = await database.universes.create({name, owners: profile[0].id});
    console.log('created universe', createdUniverse);
    return json({universe: createdUniverse[0]});
}
